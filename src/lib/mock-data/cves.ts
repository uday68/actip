import { CVERecord } from '@/types/cti';

export const mockCves: CVERecord[] = [
  {
    id: 'CVE-2026-8912',
    title: 'Enterprise Edge Gateway Unauthenticated Remote Code Execution',
    cvss: 9.8,
    severity: 'critical',
    publishedDate: '2026-08-25',
    modifiedDate: '2026-09-08',
    cisaKev: true,
    knownExploitation: true,
    affectsOrganization: 'confirmed',
    affectedProducts: [
      'EdgeSecure Gateway OS v11.2 - v12.4',
      'SecureGate Concentrator Appliance Model 4000/5000'
    ],
    associatedMalware: ['BlackVenom RAT v3.2', 'CobaltLoader'],
    associatedActors: ['APT-84 (RedBanshee)'],
    associatedCampaigns: ['Operation Arctic Ghost'],
    epssScore: 0.941,
    description:
      'Improper input neutralization in the HTTP management interface listener on port 8443 enables remote, unauthenticated attackers to execute arbitrary shell commands with root privileges via a crafted HTTP POST request.',
    remediation:
      'Apply vendor emergency firmware patch v12.4.2 immediately. Disable WAN-facing administrative management endpoints or enforce strict IP allowlisting at perimeter ACLs.'
  },
  {
    id: 'CVE-2026-4401',
    title: 'SMBv3 Protocol Buffer Overflow Denial of Service and Pre-Auth RCE',
    cvss: 8.8,
    severity: 'high',
    publishedDate: '2026-06-14',
    modifiedDate: '2026-08-19',
    cisaKev: true,
    knownExploitation: true,
    affectsOrganization: 'none',
    affectedProducts: ['Legacy Windows Server 2019/2022 (Unpatched KB910291)'],
    associatedMalware: ['DarkLocker Ransomware'],
    associatedActors: ['FIN-3382 Syndicate'],
    associatedCampaigns: ['Operation BlackCipher'],
    epssScore: 0.812,
    description:
      'A vulnerability in the handling of SMBv3 compressed packets allows an unauthenticated attacker to cause heap exhaustion or execute remote code.',
    remediation:
      'Block TCP port 445 at external network perimeters and deploy patch KB910291 across all domain controllers.'
  },
  {
    id: 'CVE-2026-2189',
    title: 'OpenSSH RegreSSHion v2 Race Condition in Signal Handler',
    cvss: 7.5,
    severity: 'high',
    publishedDate: '2026-07-02',
    modifiedDate: '2026-07-28',
    cisaKev: false,
    knownExploitation: false,
    affectsOrganization: 'suspected',
    affectedProducts: ['OpenSSH 8.5p1 through 9.8p1 on glibc Linux'],
    associatedMalware: [],
    associatedActors: ['PhantomPanda (Targeted Scanning)'],
    associatedCampaigns: [],
    epssScore: 0.315,
    description:
      'A signal handler race condition in OpenSSH server (sshd) allows unauthenticated remote attackers to execute code as root under specific ASLR layout conditions.',
    remediation:
      'Update OpenSSH to version 9.8p2 or set LoginGraceTime to 0 in sshd_config to prevent the timeout signal handler trigger.'
  },
  {
    id: 'CVE-2025-50211',
    title: 'Enterprise VPN Client Local Privilege Escalation via Named Pipe',
    cvss: 6.8,
    severity: 'medium',
    publishedDate: '2025-11-20',
    modifiedDate: '2026-02-14',
    cisaKev: false,
    knownExploitation: true,
    affectsOrganization: 'none',
    affectedProducts: ['AeroConnect VPN Desktop Client < v4.9.1'],
    associatedMalware: ['BlackVenom RAT v3.2'],
    associatedActors: ['APT-84 (RedBanshee)'],
    associatedCampaigns: ['Operation Arctic Ghost'],
    epssScore: 0.128,
    description:
      'Insecure discretionary access control lists (DACLs) on local RPC named pipes allow authenticated standard users to execute binaries with SYSTEM privileges.',
    remediation: 'Upgrade AeroConnect VPN client to release v4.9.2 or higher.'
  }
];

