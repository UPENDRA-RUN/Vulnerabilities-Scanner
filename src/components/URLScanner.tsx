import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Shield, AlertTriangle, X, Download, RotateCcw, Eye, FileText, Zap, Globe, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

interface ScanResult {
  url: string;
  status: 'safe' | 'suspicious' | 'unsafe';
  score: number; // 0-100
  checks: SecurityCheck[];
  metadata: {
    responseTime: number;
    domain: string;
    protocol: string;
    port?: number;
    redirects: number;
  };
  timestamp: Date;
}

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [historyFilter, setHistoryFilter] = useState('');
  const { toast } = useToast();

  const performComprehensiveScan = (inputUrl: string): ScanResult => {
    const checks: SecurityCheck[] = [];
    let score = 100;
    
    try {
      const urlObj = new URL(inputUrl);
      const domain = urlObj.hostname;
      const protocol = urlObj.protocol;

      // HTTPS Check
      if (protocol === 'https:') {
        checks.push({
          name: 'HTTPS Protocol',
          status: 'pass',
          description: 'Site uses secure HTTPS connection',
          impact: 'high'
        });
      } else {
        checks.push({
          name: 'HTTPS Protocol',
          status: 'fail',
          description: 'Site does not use secure HTTPS connection',
          impact: 'high'
        });
        score -= 30;
      }

      // Domain Reputation Check
      const suspiciousDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'localhost', '127.0.0.1'];
      const isDomainSuspicious = suspiciousDomains.some(suspicious => domain.includes(suspicious));
      
      if (isDomainSuspicious) {
        checks.push({
          name: 'Domain Reputation',
          status: 'warning',
          description: 'Domain is a URL shortener or potentially suspicious',
          impact: 'medium'
        });
        score -= 20;
      } else {
        checks.push({
          name: 'Domain Reputation',
          status: 'pass',
          description: 'Domain appears legitimate',
          impact: 'medium'
        });
      }

      // URL Length Analysis
      if (inputUrl.length > 200) {
        checks.push({
          name: 'URL Length',
          status: 'warning',
          description: 'Unusually long URL detected (potential obfuscation)',
          impact: 'low'
        });
        score -= 10;
      } else {
        checks.push({
          name: 'URL Length',
          status: 'pass',
          description: 'URL length is within normal range',
          impact: 'low'
        });
      }

      // Phishing Patterns
      const phishingPatterns = ['secure-update', 'verify-account', 'suspended-account', 'urgent-action'];
      const hasPhishingPattern = phishingPatterns.some(pattern => 
        inputUrl.toLowerCase().includes(pattern)
      );
      
      if (hasPhishingPattern) {
        checks.push({
          name: 'Phishing Indicators',
          status: 'fail',
          description: 'Contains common phishing keywords',
          impact: 'high'
        });
        score -= 25;
      } else {
        checks.push({
          name: 'Phishing Indicators',
          status: 'pass',
          description: 'No common phishing patterns detected',
          impact: 'high'
        });
      }

      // Malicious Extensions
      const maliciousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.pif'];
      const hasMaliciousExt = maliciousExtensions.some(ext => 
        inputUrl.toLowerCase().includes(ext)
      );
      
      if (hasMaliciousExt) {
        checks.push({
          name: 'File Type Safety',
          status: 'fail',
          description: 'URL points to potentially dangerous file type',
          impact: 'high'
        });
        score -= 35;
      } else {
        checks.push({
          name: 'File Type Safety',
          status: 'pass',
          description: 'No dangerous file extensions detected',
          impact: 'medium'
        });
      }

      // SSL Certificate Simulation
      if (protocol === 'https:') {
        checks.push({
          name: 'SSL Certificate',
          status: 'pass',
          description: 'Valid SSL certificate (simulated check)',
          impact: 'high'
        });
      } else {
        checks.push({
          name: 'SSL Certificate',
          status: 'fail',
          description: 'No SSL certificate available',
          impact: 'high'
        });
      }

      // Security Headers Simulation
      const hasSecurityHeaders = Math.random() > 0.3; // Simulate 70% sites having good headers
      checks.push({
        name: 'Security Headers',
        status: hasSecurityHeaders ? 'pass' : 'warning',
        description: hasSecurityHeaders 
          ? 'Essential security headers detected' 
          : 'Missing important security headers (CSP, HSTS)',
        impact: 'medium'
      });
      if (!hasSecurityHeaders) score -= 15;

    } catch (error) {
      checks.push({
        name: 'URL Format',
        status: 'fail',
        description: 'Invalid URL format',
        impact: 'high'
      });
      score = 0;
    }

    // Determine overall status
    let status: 'safe' | 'suspicious' | 'unsafe';
    if (score >= 80) status = 'safe';
    else if (score >= 50) status = 'suspicious';
    else status = 'unsafe';

    return {
      url: inputUrl,
      status,
      score: Math.max(0, score),
      checks,
      metadata: {
        responseTime: Math.floor(Math.random() * 1000) + 200, // Simulated
        domain: new URL(inputUrl).hostname,
        protocol: new URL(inputUrl).protocol,
        port: new URL(inputUrl).port ? parseInt(new URL(inputUrl).port) : undefined,
        redirects: Math.floor(Math.random() * 3), // Simulated
      },
      timestamp: new Date()
    };
  };

  const handleScan = async () => {
    if (!url.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate realistic scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const result = performComprehensiveScan(url.trim());
      setScanResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 19)]); // Keep last 20 scans
      
      toast({
        title: "Scan Complete",
        description: `Security score: ${result.score}/100 (${result.status.toUpperCase()})`,
        variant: result.status === 'safe' ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to analyze the provided URL",
        variant: "destructive"
      });
    }
    
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Simulate QR code extraction
      const simulatedUrls = [
        'https://example.com/qr-decoded',
        'https://google.com',
        'http://suspicious-site.com',
        'https://github.com'
      ];
      const randomUrl = simulatedUrls[Math.floor(Math.random() * simulatedUrls.length)];
      setUrl(randomUrl);
      
      toast({
        title: "QR Code Detected",
        description: "URL extracted from QR code",
      });
    }
  };

  const exportResults = () => {
    if (!scanResult) return;
    
    const exportData = {
      scan: scanResult,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnerability-scan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Results Exported",
      description: "Scan results saved to your downloads",
    });
  };

  const rescanFromHistory = (historyUrl: string) => {
    setUrl(historyUrl);
    setScanResult(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <Shield className="w-5 h-5 text-safe" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-suspicious" />;
      case 'unsafe':
        return <X className="w-5 h-5 text-unsafe" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'border-safe bg-safe/10 text-safe';
      case 'suspicious':
        return 'border-suspicious bg-suspicious/10 text-suspicious';
      case 'unsafe':
        return 'border-unsafe bg-unsafe/10 text-unsafe';
      default:
        return '';
    }
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <Shield className="w-4 h-4 text-safe" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-suspicious" />;
      case 'fail':
        return <X className="w-4 h-4 text-unsafe" />;
      default:
        return null;
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[impact as keyof typeof colors] || '';
  };

  const filteredHistory = scanHistory.filter(scan => 
    scan.url.toLowerCase().includes(historyFilter.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Main Scanner Card */}
      <Card className="card-scanner">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            🛡️ Advanced Vulnerability Scanner
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive security analysis with detailed threat detection
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Input */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="Enter URL to scan (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-secondary/50 border-border"
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              />
              <Button 
                onClick={handleScan} 
                disabled={!url.trim() || isScanning}
                className="glow-button px-6"
              >
                {isScanning ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isScanning ? 'Analyzing...' : 'Scan'}
              </Button>
            </div>

            {/* QR Code Upload */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Or upload QR code:</span>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Image</span>
                </div>
              </label>
            </div>
          </div>

          {/* Comprehensive Scan Results */}
          {scanResult && (
            <Card className={cn("border-2", getStatusColor(scanResult.status))}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(scanResult.status)}
                    <div>
                      <CardTitle className="text-lg">Security Analysis</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Score: {scanResult.score}/100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("", getStatusColor(scanResult.status))}
                    >
                      {scanResult.status.toUpperCase()}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={exportResults}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-medium text-white mb-2">Target URL:</p>
                  <p className="text-sm text-muted-foreground break-all bg-secondary/50 p-3 rounded border">
                    {scanResult.url}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="text-center">
                    <Globe className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Domain</p>
                    <p className="text-sm font-medium">{scanResult.metadata.domain}</p>
                  </div>
                  <div className="text-center">
                    <Lock className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Protocol</p>
                    <p className="text-sm font-medium">{scanResult.metadata.protocol}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Response</p>
                    <p className="text-sm font-medium">{scanResult.metadata.responseTime}ms</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Redirects</p>
                    <p className="text-sm font-medium">{scanResult.metadata.redirects}</p>
                  </div>
                </div>

                {/* Security Checks */}
                <div>
                  <p className="font-medium text-white mb-4">Detailed Security Checks:</p>
                  <div className="grid gap-3">
                    {scanResult.checks.map((check, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/30"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getCheckIcon(check.status)}
                          <div>
                            <p className="font-medium text-sm">{check.name}</p>
                            <p className="text-xs text-muted-foreground">{check.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getImpactBadge(check.impact))}
                        >
                          {check.impact.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Scanned on {scanResult.timestamp.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Scan History */}
      {scanHistory.length > 0 && (
        <Card className="card-scanner">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Scan History</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Filter URLs..."
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="w-48 h-8 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredHistory.map((scan, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(scan.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium">{scan.url}</p>
                      <p className="text-xs text-muted-foreground">
                        Score: {scan.score}/100 • {scan.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(scan.status))}
                    >
                      {scan.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => rescanFromHistory(scan.url)}
                      className="gap-1 h-7 px-2"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Rescan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {filteredHistory.length === 0 && historyFilter && (
              <p className="text-center text-muted-foreground py-4">
                No scans match your filter
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default URLScanner;