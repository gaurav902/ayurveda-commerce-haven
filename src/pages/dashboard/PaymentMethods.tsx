import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const paymentMethodSchema = z.object({
  card_number: z.string()
    .min(13, 'Card number must be at least 13 digits')
    .max(19, 'Card number must not exceed 19 digits')
    .regex(/^\d+$/, 'Card number must contain only digits'),
  cardholder_name: z.string().min(1, 'Cardholder name is required'),
  expiry_month: z.string().min(1, 'Expiry month is required'),
  expiry_year: z.string().min(1, 'Expiry year is required'),
  card_type: z.string().min(1, 'Card type is required'),
  is_default: z.boolean().default(false),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

const PaymentMethods = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      card_number: '',
      cardholder_name: '',
      expiry_month: '',
      expiry_year: '',
      card_type: '',
      is_default: false,
    },
  });

  // Fetch payment methods
  const { data: paymentMethods, isLoading, refetch } = useQuery({
    queryKey: ['paymentMethods', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const openAddDialog = () => {
    setEditingPayment(null);
    form.reset({
      card_number: '',
      cardholder_name: '',
      expiry_month: '',
      expiry_year: '',
      card_type: '',
      is_default: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (payment: any) => {
    setEditingPayment(payment);
    form.reset({
      card_number: payment.card_number,
      cardholder_name: payment.cardholder_name,
      expiry_month: payment.expiry_month,
      expiry_year: payment.expiry_year,
      card_type: payment.card_type,
      is_default: payment.is_default,
    });
    setIsDialogOpen(true);
  };

  const handleDeletePayment = async (id: string) => {
    if (!user) return;
    
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Payment method deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      // First, remove default from all payment methods
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Set this payment method as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Default payment method updated');
      refetch();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
    }
  };

  const onSubmit = async (values: PaymentMethodFormValues) => {
    if (!user) return;
    
    try {
      // Mask card number for storage (only keep last 4 digits visible)
      const masked_card_number = values.card_number.slice(-4).padStart(values.card_number.length, '*');
      
      // If setting as default, remove default from all other payment methods
      if (values.is_default) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }
      
      if (editingPayment) {
        // Update existing payment method
        const { error } = await supabase
          .from('payment_methods')
          .update({
            card_number: masked_card_number,
            cardholder_name: values.cardholder_name,
            expiry_month: values.expiry_month,
            expiry_year: values.expiry_year,
            card_type: values.card_type,
            is_default: values.is_default,
          })
          .eq('id', editingPayment.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        toast.success('Payment method updated successfully');
      } else {
        // Create new payment method
        const { error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            card_number: masked_card_number,
            cardholder_name: values.cardholder_name,
            expiry_month: values.expiry_month,
            expiry_year: values.expiry_year,
            card_type: values.card_type,
            is_default: values.is_default,
          });
        
        if (error) throw error;
        toast.success('Payment method added successfully');
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method');
    }
  };

  const getCardTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      case 'discover':
        return '💳 Discover';
      default:
        return '💳 Card';
    }
  };

  const years = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserDashboardSidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Payment Methods</h1>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Card
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !paymentMethods || paymentMethods.length === 0 ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No payment methods</h3>
                <p className="text-muted-foreground mb-6">Add a payment method for a smoother checkout experience</p>
                <Button onClick={openAddDialog}>Add Payment Method</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((payment: any) => (
                  <Card key={payment.id} className={payment.is_default ? 'border-primary' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center">
                          {payment.is_default && (
                            <span className="inline-flex items-center mr-2 text-primary">
                              <Star className="h-4 w-4 fill-current" />
                            </span>
                          )}
                          {getCardTypeIcon(payment.card_type)}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-lg font-mono">{payment.card_number}</p>
                      <p className="text-sm text-muted-foreground">{payment.cardholder_name}</p>
                      <p className="text-sm text-muted-foreground">Expires: {payment.expiry_month}/{payment.expiry_year}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(payment)}
                        >
                          Edit
                        </Button>
                        {!payment.is_default && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleSetDefault(payment.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeletePayment(payment.id)}
                        disabled={isDeleting === payment.id}
                      >
                        {isDeleting === payment.id ? (
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

            {/* Payment Method Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="card_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select card type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="visa">Visa</SelectItem>
                              <SelectItem value="mastercard">Mastercard</SelectItem>
                              <SelectItem value="amex">American Express</SelectItem>
                              <SelectItem value="discover">Discover</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="card_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Card number" 
                              {...field} 
                              maxLength={19}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardholder_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Name on card" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiry_month"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Month</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="MM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {months.map(month => (
                                  <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="expiry_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Year</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="YYYY" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {years.map(year => (
                                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
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
                            Set as default payment method
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingPayment ? 'Update' : 'Save'} Card
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

export default PaymentMethods;
