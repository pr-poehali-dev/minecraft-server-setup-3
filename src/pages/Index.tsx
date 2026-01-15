import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [copiedIP, setCopiedIP] = useState(false);
  const [serverStats, setServerStats] = useState({
    online: 0,
    max: 0,
    version: '1.15.2',
    latency: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const serverIP = 'fersik.aternos.me:37244';

  const copyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopiedIP(true);
    toast({
      title: "IP скопирован!",
      description: "IP-адрес сервера скопирован в буфер обмена",
    });
    setTimeout(() => setCopiedIP(false), 2000);
  };

  const fetchServerStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/2604d888-fbdf-48a6-bbf0-45261efff537');
      const data = await response.json();
      
      if (data.error) {
        setServerStatus('offline');
      } else {
        setServerStatus('online');
      }
      
      setServerStats({
        online: data.online || 0,
        max: data.max || 0,
        version: data.version || '1.15.2',
        latency: data.latency || 0
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching server stats:', error);
      setServerStatus('offline');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStats();
    const interval = setInterval(fetchServerStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Онлайн', value: isLoading ? '...' : `${serverStats.online}`, icon: 'Users' },
    { label: 'Кланов', value: '0', icon: 'Shield' },
    { label: 'Активных', value: '0', icon: 'TrendingUp' },
    { label: 'Версия', value: serverStats.version, icon: 'Package' },
  ];

  const rules = [
    { title: 'Уважение', desc: 'Относись к игрокам с уважением', icon: 'Heart' },
    { title: 'Запрет читов', desc: 'Использование читов приведет к бану', icon: 'ShieldAlert' },
    { title: 'Без гриферства', desc: 'Не ломайте постройки других игроков', icon: 'Home' },
    { title: 'Чистый чат', desc: 'Без мата, спама и рекламы', icon: 'MessageSquare' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
      
      <div className="relative">
        <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            {serverStatus === 'checking' && (
              <Badge className="gradient-primary text-white text-sm px-4 py-2">
                <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Проверка сервера...
              </Badge>
            )}
            {serverStatus === 'online' && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
                Сервер онлайн
              </Badge>
            )}
            {serverStatus === 'offline' && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-white mr-2" />
                Сервер оффлайн
              </Badge>
            )}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            FersikMine
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Лучший сервер выживания с кланами, прогрессией и дружным комьюнити
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-6 py-4 rounded-lg border border-primary/20">
              <code className="text-xl md:text-2xl font-mono text-primary">{serverIP}</code>
              <Button
                onClick={copyIP}
                size="icon"
                className="gradient-primary hover:opacity-90 transition-all"
              >
                <Icon name={copiedIP ? "Check" : "Copy"} className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
                <CardContent className="pt-6 text-center">
                  <Icon name={stat.icon as any} className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Правила сервера
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {rules.map((rule, index) => (
              <Card 
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-3">
                    <Icon name={rule.icon as any} className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{rule.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{rule.desc}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Как подключиться
          </h2>
          
          <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Инструкция по подключению</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold">Запустите Minecraft</p>
                  <p className="text-muted-foreground">Версия 1.15.2</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold">Нажмите "Сетевая игра"</p>
                  <p className="text-muted-foreground">В главном меню игры</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold">Добавьте сервер</p>
                  <p className="text-muted-foreground">IP: <code className="text-primary font-mono">{serverIP}</code></p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold">Подключайтесь и играйте!</p>
                  <p className="text-muted-foreground">Добро пожаловать на сервер</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="container mx-auto px-4 py-12 border-t border-primary/20 mt-16">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FersikMine Server
            </h3>
            <p className="text-muted-foreground">
              Создано с ❤️ для игроков
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="MessageCircle" className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Send" className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Youtube" className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;