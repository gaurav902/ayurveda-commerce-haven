
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const addressSchema = z.object({
  address_line: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
  is_default: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const Addresses = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line: '',
      city: '',
      state: '',
      pincode: '',
      is_default: false,
    },
  });

  // Fetch addresses
  const { data: addresses, isLoading, refetch } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const openAddDialog = () => {
    setEditingAddress(null);
    form.reset({
      address_line: '',
      city: '',
      state: '',
      pincode: '',
      is_default: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: any) => {
    setEditingAddress(address);
    form.reset({
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Address deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      // First, remove default from all addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Set this address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Default address updated');
      refetch();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  const onSubmit = async (values: AddressFormValues) => {
    if (!user) return;
    
    try {
      // If setting as default, remove default from all other addresses
      if (values.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }
      
      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('addresses')
          .update({
            address_line: values.address_line,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            is_default: values.is_default,
          })
          .eq('id', editingAddress.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        toast.success('Address updated successfully');
      } else {
        // Create new address
        const { error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            address_line: values.address_line,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            is_default: values.is_default,
          });
        
        if (error) throw error;
        toast.success('Address added successfully');
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserDashboardSidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">My Addresses</h1>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !addresses || addresses.length === 0 ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No saved addresses</h3>
                <p className="text-muted-foreground mb-6">Add your delivery addresses for a smoother checkout experience</p>
                <Button onClick={openAddDialog}>Add New Address</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address: any) => (
                  <Card key={address.id} className={address.is_default ? 'border-primary' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {address.is_default && (
                            <span className="inline-flex items-center mr-2 text-primary">
                              <Star className="h-4 w-4 fill-current" />
                            </span>
                          )}
                          {address.is_default ? 'Default Address' : 'Delivery Address'}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p>{address.address_line}</p>
                      <p>{address.city}, {address.state}, {address.pincode}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(address)}
                        >
                          Edit
                        </Button>
                        {!address.is_default && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={isDeleting === address.id}
                      >
                        {isDeleting === address.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Address Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address_line"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="Pincode" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="is_default"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Set as default address
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingAddress ? 'Update' : 'Save'} Address
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Addresses;
