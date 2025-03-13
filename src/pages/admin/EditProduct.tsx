
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  price: z.string().min(1, {
    message: 'Price is required.',
  }),
  stock: z.string().min(1, {
    message: 'Stock is required.',
  }),
  image_url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  category: z.string().min(1, {
    message: 'Please select a category.',
  }),
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
      category: '',
    },
  });

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: productCategory } = useQuery({
    queryKey: ['productCategory', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('category_id')
        .eq('product_id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!product,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (product && productCategory) {
      form.reset({
        name: product.name,
        description: product.description,
        price: (product.price / 100).toString(),
        stock: product.stock.toString(),
        image_url: product.image_url || '',
        category: productCategory.category_id,
      });
    }
  }, [product, productCategory, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert price to paise
      const priceInPaise = Math.round(parseFloat(values.price) * 100);
      
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: values.name,
          description: values.description,
          price: priceInPaise,
          stock: parseInt(values.stock),
          image_url: values.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (productError) throw productError;
      
      // Update product category if changed
      if (productCategory && values.category !== productCategory.category_id) {
        // Delete existing relationship
        const { error: deleteError } = await supabase
          .from('product_categories')
          .delete()
          .eq('product_id', id);
        
        if (deleteError) throw deleteError;
        
        // Create new relationship
        const { error: insertError } = await supabase
          .from('product_categories')
          .insert({
            product_id: id,
            category_id: values.category,
          });
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: 'Product updated successfully',
        description: `${values.name} has been updated.`,
      });
      
      navigate('/admin/products');
    } catch (error: any) {
      toast({
        title: 'Error updating product',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (productLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            <div className="flex-1 flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or you don't have permission to view it.</p>
                <Link to="/admin/products">
                  <Button>Back to Products</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminSidebar />
          
          <div className="flex-1">
            <div className="flex items-center mb-6">
              <Link to="/admin/products" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Edit Product</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter product description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (INR)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriesLoading ? (
                              <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                            ) : categories && categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>No categories found</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Link to="/admin/products" className="mr-4">
                      <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit">Update Product</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
