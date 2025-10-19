import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LogOut, Sparkles } from 'lucide-react';
import { User } from '@supabase/supabase-js';

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "La revedere!",
        description: "Te-ai deconectat cu succes"
      });
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="animate-pulse text-muted-foreground">Se încarcă...</div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bună dimineața';
    if (hour < 18) return 'Bună ziua';
    return 'Bună seara';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <div className="bg-card rounded-3xl shadow-[var(--shadow-large)] p-8 backdrop-blur-[var(--ios-blur)] mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-medium)]">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {getGreeting()}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-2xl h-12 px-6 border-border hover:bg-secondary/50 transition-[var(--transition-smooth)]"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Ieșire
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Bine ai venit în aplicație!
              </h2>
              <p className="text-muted-foreground">
                Aceasta este o aplicație mobilă nativă construită cu React și Capacitor, cu design elegant iOS.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="font-semibold text-foreground mb-1">iOS & Android</h3>
                <p className="text-sm text-muted-foreground">Compatibil cu ambele platforme</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
                <div className="text-4xl mb-2">🔐</div>
                <h3 className="font-semibold text-foreground mb-1">Securizat</h3>
                <p className="text-sm text-muted-foreground">Autentificare completă</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-sm">
          <p>Aplicație mobilă nativă • React + Capacitor</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
