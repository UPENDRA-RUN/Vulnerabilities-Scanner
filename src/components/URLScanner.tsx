import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Shield, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanResult {
  url: string;
  status: 'safe' | 'suspicious' | 'unsafe';
  checks: {
    httpsUsed: boolean;
    validFormat: boolean;
    suspiciousPattern: boolean;
    urlLength: number;
  };
  timestamp: Date;
}

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const validateURL = (inputUrl: string): ScanResult => {
    const checks = {
      httpsUsed: inputUrl.startsWith('https://'),
      validFormat: /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(inputUrl),
      suspiciousPattern: /(?:bit\.ly|tinyurl|t\.co|goo\.gl|localhost|127\.0\.0\.1|192\.168|10\.|172\.)/i.test(inputUrl),
      urlLength: inputUrl.length
    };

    let status: 'safe' | 'suspicious' | 'unsafe' = 'safe';

    if (!checks.validFormat) {
      status = 'unsafe';
    } else if (!checks.httpsUsed || checks.suspiciousPattern || checks.urlLength > 200) {
      status = 'suspicious';
    }

    return {
      url: inputUrl,
      status,
      checks,
      timestamp: new Date()
    };
  };

  const handleScan = async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = validateURL(url.trim());
    setScanResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 scans
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // In a real implementation, you'd use a QR code library like qrcode-reader
      // For now, we'll simulate QR code detection
      setUrl('https://example.com/qr-decoded-url');
    }
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Scanner Card */}
      <Card className="card-scanner">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            🛡️ Vulnerabilities Scanner
          </CardTitle>
          <p className="text-muted-foreground">
            Analyze URLs for security vulnerabilities and potential threats
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
                {isScanning ? 'Scanning...' : 'Scan'}
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

          {/* Scan Results */}
          {scanResult && (
            <Card className={cn("border-2", getStatusColor(scanResult.status))}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  {getStatusIcon(scanResult.status)}
                  Scan Results
                  <Badge 
                    variant="outline" 
                    className={cn("ml-auto", getStatusColor(scanResult.status))}
                  >
                    {scanResult.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-white mb-2">URL:</p>
                  <p className="text-sm text-muted-foreground break-all bg-secondary/50 p-2 rounded">
                    {scanResult.url}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-white">Security Checks:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        {scanResult.checks.httpsUsed ? (
                          <Shield className="w-4 h-4 text-safe" />
                        ) : (
                          <X className="w-4 h-4 text-unsafe" />
                        )}
                        HTTPS Protocol: {scanResult.checks.httpsUsed ? 'Enabled' : 'Disabled'}
                      </div>
                      <div className="flex items-center gap-2">
                        {scanResult.checks.validFormat ? (
                          <Shield className="w-4 h-4 text-safe" />
                        ) : (
                          <X className="w-4 h-4 text-unsafe" />
                        )}
                        Valid Format: {scanResult.checks.validFormat ? 'Yes' : 'No'}
                      </div>
                      <div className="flex items-center gap-2">
                        {!scanResult.checks.suspiciousPattern ? (
                          <Shield className="w-4 h-4 text-safe" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-suspicious" />
                        )}
                        Suspicious Patterns: {scanResult.checks.suspiciousPattern ? 'Detected' : 'None'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-white">Additional Info:</p>
                    <div className="space-y-1 text-sm">
                      <p>URL Length: {scanResult.checks.urlLength} characters</p>
                      <p>Scanned: {scanResult.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card className="card-scanner">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.map((scan, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(scan.status)}
                    <span className="text-sm truncate">{scan.url}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(scan.status))}
                    >
                      {scan.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {scan.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default URLScanner;