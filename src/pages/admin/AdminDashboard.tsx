
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as ChartIcon, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

// Mock data - would come from API in a real app
const revenueData = [
  { name: "Jan", revenue: 1100 },
  { name: "Feb", revenue: 1400 },
  { name: "Mar", revenue: 1200 },
  { name: "Apr", revenue: 1300 },
  { name: "May", revenue: 1700 },
  { name: "Jun", revenue: 1600 },
  { name: "Jul", revenue: 1800 },
];

const ordersData = [
  { name: "Jan", orders: 32 },
  { name: "Feb", orders: 45 },
  { name: "Mar", orders: 38 },
  { name: "Apr", orders: 41 },
  { name: "May", orders: 53 },
  { name: "Jun", orders: 49 },
  { name: "Jul", orders: 61 },
];

const recentOrders = [
  { id: "#1089", customer: "Alice Smith", date: "3 hours ago", total: "$129.99", status: "Pending" },
  { id: "#1088", customer: "Bob Johnson", date: "5 hours ago", total: "$83.45", status: "Completed" },
  { id: "#1087", customer: "Carol Davis", date: "1 day ago", total: "$214.00", status: "Completed" },
  { id: "#1086", customer: "David Brown", date: "1 day ago", total: "$76.20", status: "Shipped" },
  { id: "#1085", customer: "Eve Wilson", date: "2 days ago", total: "$149.99", status: "Completed" },
];

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and authorization
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <AdminSidebar />
          </div>
          
          <div className="md:col-span-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <h4 className="text-2xl font-medium">$9,240</h4>
                      <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+14.2% from last month</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <DollarSign size={24} className="text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Orders</p>
                      <h4 className="text-2xl font-medium">318</h4>
                      <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+24.5% from last month</span>
                      </div>
                    </div>
                    <div className="bg-ayurveda-amber/10 p-3 rounded-full">
                      <ShoppingCart size={24} className="text-ayurveda-amber" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Products</p>
                      <h4 className="text-2xl font-medium">152</h4>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock size={14} className="mr-1" />
                        <span>16 added this month</span>
                      </div>
                    </div>
                    <div className="bg-ayurveda-sage/10 p-3 rounded-full">
                      <Package size={24} className="text-ayurveda-sage" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Customers</p>
                      <h4 className="text-2xl font-medium">573</h4>
                      <div className="flex items-center mt-1 text-xs text-red-600">
                        <TrendingDown size={14} className="mr-1" />
                        <span>-3.2% from last month</span>
                      </div>
                    </div>
                    <div className="bg-ayurveda-clay/10 p-3 rounded-full">
                      <Users size={24} className="text-ayurveda-clay" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Revenue & Orders Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="revenue">
                  <TabsList className="mb-4">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>
                  <TabsContent value="revenue">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={revenueData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, 'Revenue']}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
                          />
                          <Bar dataKey="revenue" fill="#00554B" barSize={40} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  <TabsContent value="orders">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={ordersData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [value, 'Orders']}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#D8A45C" 
                            strokeWidth={2} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Total</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-none">
                          <td className="py-4 text-primary">{order.id}</td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4 text-muted-foreground">{order.date}</td>
                          <td className="py-4 font-medium">{order.total}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
