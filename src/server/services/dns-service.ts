import dns from 'dns';
const { promises: dnsPromises } = dns;

export interface DnsRecordResult {
  recordType: string;
  value: string;
  ttl?: number;
  firstSeen: string;
  lastSeen: string;
}

export interface DnsEnrichmentResult {
  target: string;
  isIp: boolean;
  latencyMs: number;
  reverseHostname?: string;
  records: DnsRecordResult[];
  nameservers: string[];
  mailServers: string[];
  txtRecords: string[];
}

export class DnsService {
  public async resolve(target: string): Promise<DnsEnrichmentResult> {
    const cleanTarget = target.trim().replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanTarget) || cleanTarget.includes(':');
    const startTime = Date.now();
    const records: DnsRecordResult[] = [];
    const nameservers: string[] = [];
    const mailServers: string[] = [];
    const txtRecords: string[] = [];
    let reverseHostname: string | undefined;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    if (isIp) {
      try {
        const hostnames = await Promise.race([
          dnsPromises.reverse(cleanTarget),
          new Promise<string[]>((_, reject) => setTimeout(() => reject(new Error('DNS Timeout')), 2500))
        ]);
        if (hostnames && hostnames.length > 0) {
          reverseHostname = hostnames[0];
          hostnames.forEach(h => {
            records.push({
              recordType: 'PTR',
              value: h,
              firstSeen: nowStr,
              lastSeen: nowStr
            });
          });
        }
      } catch (err) {
        // Reverse DNS may not exist for all public IPs
      }
    } else {
      // It's a domain name - query A, AAAA, MX, NS, TXT
      try {
        const aRecords = await Promise.race([
          dnsPromises.resolve4(cleanTarget),
          new Promise<string[]>((_, reject) => setTimeout(() => reject(new Error('DNS Timeout')), 2500))
        ]);
        aRecords.forEach(ip => {
          records.push({
            recordType: 'A',
            value: ip,
            firstSeen: nowStr,
            lastSeen: nowStr
          });
        });
      } catch (e) {
        // Domain might not have direct A record or NXDOMAIN
      }

      try {
        const mxRecords = await dnsPromises.resolveMx(cleanTarget);
        mxRecords.forEach(mx => {
          mailServers.push(`${mx.exchange} (pri: ${mx.priority})`);
          records.push({
            recordType: 'MX',
            value: `${mx.exchange} [priority ${mx.priority}]`,
            firstSeen: nowStr,
            lastSeen: nowStr
          });
        });
      } catch (e) {}

      try {
        const nsRecords = await dnsPromises.resolveNs(cleanTarget);
        nsRecords.forEach(ns => {
          nameservers.push(ns);
          records.push({
            recordType: 'NS',
            value: ns,
            firstSeen: nowStr,
            lastSeen: nowStr
          });
        });
      } catch (e) {}

      try {
        const txts = await dnsPromises.resolveTxt(cleanTarget);
        txts.forEach(tArr => {
          const joined = tArr.join(' ');
          txtRecords.push(joined);
          records.push({
            recordType: 'TXT',
            value: joined.length > 100 ? joined.substring(0, 97) + '...' : joined,
            firstSeen: nowStr,
            lastSeen: nowStr
          });
        });
      } catch (e) {}
    }

    const latencyMs = Date.now() - startTime;

    return {
      target: cleanTarget,
      isIp,
      latencyMs,
      reverseHostname,
      records,
      nameservers,
      mailServers,
      txtRecords
    };
  }
}

export const dnsService = new DnsService();
