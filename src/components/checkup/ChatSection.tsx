
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckupApplication, Message } from "@/types";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface ChatSectionProps {
  applicationId?: string;
  doctorView?: boolean;
  patientId?: string;
  doctorId?: string;
}

const ChatSection = ({ applicationId, doctorView = false, patientId, doctorId }: ChatSectionProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [application, setApplication] = useState<CheckupApplication | null>(null);

  useEffect(() => {
    if (applicationId) {
      fetchMessages();
      fetchApplication();
    }
  }, [applicationId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchApplication = async () => {
    if (!applicationId) return;
    
    try {
      const { data, error } = await supabase
        .from('checkup_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
        
      if (error) throw error;
      if (data) {
        setApplication(data as CheckupApplication);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  };

  const fetchMessages = async () => {
    if (!applicationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkup_chat_messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !applicationId) return;
    
    try {
      const messageData = {
        application_id: applicationId,
        sender_id: user.id,
        sender_type: doctorView ? 'doctor' : 'user',
        content: newMessage.trim()
      };
      
      const { error } = await supabase
        .from('checkup_chat_messages')
        .insert(messageData);
        
      if (error) throw error;
      
      setNewMessage("");
      fetchMessages();
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  if (!applicationId) {
    return (
      <Card className="h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground">Select a checkup application to start chatting</p>
      </Card>
    );
  }

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">
          {application ? (
            doctorView ? `Chat with Patient: ${application.full_name}` : "Chat with Doctor"
          ) : "Loading..."}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto pb-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender_type === (doctorView ? 'doctor' : 'user') ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.sender_type !== (doctorView ? 'doctor' : 'user') && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.sender_type === 'doctor' ? 'DR' : 'PT'}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`rounded-lg px-3 py-2 ${
                    message.sender_type === (doctorView ? 'doctor' : 'user') 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{formatDate(message.created_at)}</p>
                  </div>
                  
                  {message.sender_type === (doctorView ? 'doctor' : 'user') && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.sender_type === 'doctor' ? 'DR' : 'PT'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatSection;
