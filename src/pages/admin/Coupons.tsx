
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Coupons = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_percentage: '',
    active: true,
    expires_at: '',
  });

  const { data: coupons, isLoading, refetch } = useQuery({
    queryKey: ['adminCoupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*, orders(count)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddCoupon = async () => {
    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: newCoupon.code.toUpperCase(),
          discount_percentage: parseInt(newCoupon.discount_percentage),
          active: newCoupon.active,
          expires_at: newCoupon.expires_at || null,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Coupon added successfully',
        description: `${newCoupon.code.toUpperCase()} has been added.`,
      });
      
      setNewCoupon({ code: '', discount_percentage: '', active: true, expires_at: '' });
      setIsAddDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error adding coupon',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCoupon = async () => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({
          code: editingCoupon.code.toUpperCase(),
          discount_percentage: parseInt(editingCoupon.discount_percentage),
          active: editingCoupon.active,
          expires_at: editingCoupon.expires_at || null,
        })
        .eq('id', editingCoupon.id);
      
      if (error) throw error;
      
      toast({
        title: 'Coupon updated successfully',
        description: `${editingCoupon.code.toUpperCase()} has been updated.`,
      });
      
      setIsEditDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Error updating coupon',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      try {
        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: 'Coupon deleted successfully',
          description: `${code} has been deleted.`,
        });
        
        refetch();
      } catch (error: any) {
        toast({
          title: 'Error deleting coupon',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <AdminSidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Coupons</h1>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : coupons && coupons.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{coupon.discount_percentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={coupon.active ? 'bg-green-500' : 'bg-red-500'}>
                              {coupon.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {coupon.expires_at ? formatDate(coupon.expires_at) : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {coupon.orders?.length || 0} orders
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingCoupon(coupon);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="mt-2 text-lg font-medium text-gray-900">No coupons found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new coupon.</p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Coupon
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Coupon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">Coupon Code</label>
              <Input
                id="code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                placeholder="SUMMER10"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="discount" className="text-sm font-medium">Discount Percentage</label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                value={newCoupon.discount_percentage}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_percentage: e.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expires" className="text-sm font-medium">Expiry Date (Optional)</label>
              <Input
                id="expires"
                type="date"
                value={newCoupon.expires_at}
                onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newCoupon.active}
                onCheckedChange={(checked) => setNewCoupon({ ...newCoupon, active: checked })}
              />
              <label htmlFor="active" className="text-sm font-medium">Active</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddCoupon} 
              disabled={!newCoupon.code || !newCoupon.discount_percentage}
            >
              Add Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          {editingCoupon && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-code" className="text-sm font-medium">Coupon Code</label>
                <Input
                  id="edit-code"
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                  placeholder="SUMMER10"
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-discount" className="text-sm font-medium">Discount Percentage</label>
                <Input
                  id="edit-discount"
                  type="number"
                  min="1"
                  max="100"
                  value={editingCoupon.discount_percentage}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_percentage: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-expires" className="text-sm font-medium">Expiry Date (Optional)</label>
                <Input
                  id="edit-expires"
                  type="date"
                  value={editingCoupon.expires_at ? new Date(editingCoupon.expires_at).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, expires_at: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingCoupon.active}
                  onCheckedChange={(checked) => setEditingCoupon({ ...editingCoupon, active: checked })}
                />
                <label htmlFor="edit-active" className="text-sm font-medium">Active</label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateCoupon} 
              disabled={!editingCoupon?.code || !editingCoupon?.discount_percentage}
            >
              Update Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Coupons;
