
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, profile, updateProfile } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [preferences, setPreferences] = useState({
    email_marketing: false,
    sms_notifications: false,
    order_updates: true,
    newsletter: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };
  
  const handlePreferenceChange = (name: string, checked: boolean) => {
    setPreferences({
      ...preferences,
      [name]: checked,
    });
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
      });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    
    try {
      if (passwordData.new_password !== passwordData.confirm_password) {
        throw new Error('New passwords do not match');
      }
      
      if (passwordData.new_password.length < 6) {
        throw new Error('Password should be at least 6 characters');
      }
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleUpdatePreferences = async () => {
    toast.success('Preferences updated successfully');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserDashboardSidebar />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed directly</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Updating...
                        </>
                      ) : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Choose a strong password and don't reuse it for other websites.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        name="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        name="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleChangePassword} 
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Updating...
                        </>
                      ) : 'Change Password'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="mr-2 h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage how we communicate with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Email Marketing</h4>
                        <p className="text-sm text-muted-foreground">Receive offers and promotions</p>
                      </div>
                      <Switch
                        checked={preferences.email_marketing}
                        onCheckedChange={(checked) => handlePreferenceChange('email_marketing', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive text messages about orders</p>
                      </div>
                      <Switch
                        checked={preferences.sms_notifications}
                        onCheckedChange={(checked) => handlePreferenceChange('sms_notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Order Updates</h4>
                        <p className="text-sm text-muted-foreground">Get notified about your order status</p>
                      </div>
                      <Switch
                        checked={preferences.order_updates}
                        onCheckedChange={(checked) => handlePreferenceChange('order_updates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Newsletter</h4>
                        <p className="text-sm text-muted-foreground">Receive our wellness newsletter</p>
                      </div>
                      <Switch
                        checked={preferences.newsletter}
                        onCheckedChange={(checked) => handlePreferenceChange('newsletter', checked)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdatePreferences}>
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
