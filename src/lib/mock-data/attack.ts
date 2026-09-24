import { AttackTechnique } from '@/types/cti';

export const mockAttackMatrix: Record<string, AttackTechnique[]> = {
  'Initial Access': [
    {
      id: 'T1190',
      name: 'Exploit Public-Facing Application',
      tactic: 'Initial Access',
      description: 'Adversaries may attempt to exploit a weakness in an Internet-facing computer or program using software, package, or service bugs.',
      associatedActors: ['APT-84 (RedBanshee)', 'PhantomPanda'],
      associatedMalware: ['CobaltLoader', 'BlackVenom RAT v3.2'],
      observedCampaigns: ['Operation Arctic Ghost'],
      evidenceCount: 18,
      detectionGuidance: 'Monitor application logs for unexpected process spawns, abnormal POST payloads, and memory segmentation crashes.'
    },
    {
      id: 'T1566.002',
      name: 'Spearphishing Link',
      tactic: 'Initial Access',
      description: 'Adversaries may send spearphishing emails with a malicious link in an attempt to gain access or direct victims to credential-harvesting sites.',
      associatedActors: ['APT-84 (RedBanshee)', 'VelvetChollima'],
      associatedMalware: ['BlackVenom RAT v3.2', 'StealthStealer v2'],
      observedCampaigns: ['Operation Arctic Ghost', 'Campaign Solstice'],
      evidenceCount: 24,
      detectionGuidance: 'Correlate perimeter mail gateway logs with URL sandbox detonation verdicts and domain age intelligence.'
    }
  ],
  'Execution': [
    {
      id: 'T1059.001',
      name: 'Command and Scripting: PowerShell',
      tactic: 'Execution',
      description: 'Adversaries may abuse PowerShell commands and scripts for execution. PowerShell is a powerful interactive command-line interface and scripting language.',
      associatedActors: ['APT-84 (RedBanshee)', 'FIN-3382 Syndicate'],
      associatedMalware: ['BlackVenom RAT v3.2'],
      observedCampaigns: ['Operation Arctic Ghost'],
      evidenceCount: 31,
      detectionGuidance: 'Enable Script Block Logging (Event ID 4104) and transcription; alert on Base64 encoded commands and non-standard execution bypass flags.'
    },
    {
      id: 'T1204.002',
      name: 'User Execution: Malicious File',
      tactic: 'Execution',
      description: 'An adversary may rely upon specific actions by a user in order to gain execution, such as opening an email attachment or clicking a lure binary.',
      associatedActors: ['VelvetChollima'],
      associatedMalware: ['StealthStealer v2'],
      observedCampaigns: ['Campaign Solstice'],
      evidenceCount: 15,
      detectionGuidance: 'Monitor process creation events where office binaries or archive utilities spawn scripting interpreters.'
    }
  ],
  'Defense Evasion': [
    {
      id: 'T1027.002',
      name: 'Obfuscated Files or Information: Software Packing',
      tactic: 'Defense Evasion',
      description: 'Adversaries may compress, encrypt, or modify an executable to make it more difficult to analyze and evade static detection signatures.',
      associatedActors: ['APT-84 (RedBanshee)'],
      associatedMalware: ['BlackVenom RAT v3.2'],
      observedCampaigns: ['Operation Arctic Ghost'],
      evidenceCount: 12,
      detectionGuidance: 'Calculate section entropy on PE binaries; entropy > 7.2 typically indicates packed code requiring sandbox unpack.'
    },
    {
      id: 'T1055.012',
      name: 'Process Injection: Process Hollowing',
      tactic: 'Defense Evasion',
      description: 'Adversaries may inject malicious code into suspended and hollowed processes in order to evade process-based defenses.',
      associatedActors: ['APT-84 (RedBanshee)'],
      associatedMalware: ['BlackVenom RAT v3.2'],
      observedCampaigns: ['Operation Arctic Ghost'],
      evidenceCount: 19,
      detectionGuidance: 'Monitor for NtUnmapViewOfSection followed by WriteProcessMemory into legitimate system processes like svchost.exe.'
    }
  ],
  'Command and Control': [
    {
      id: 'T1071.001',
      name: 'Application Layer Protocol: Web Protocols',
      tactic: 'Command and Control',
      description: 'Adversaries may communicate using application layer protocols (e.g., HTTP/HTTPS) to avoid detection through firewalls and proxies.',
      associatedActors: ['APT-84 (RedBanshee)', 'VelvetChollima', 'PhantomPanda'],
      associatedMalware: ['BlackVenom RAT v3.2', 'StealthStealer v2'],
      observedCampaigns: ['Operation Arctic Ghost', 'Campaign Solstice'],
      evidenceCount: 42,
      detectionGuidance: 'Inspect TLS JA3/JARM fingerprints, periodic beacon intervals with low jitter, and requests to high-risk dynamic DNS hostnames.'
    },
    {
      id: 'T1573.002',
      name: 'Encrypted Channel: Asymmetric Cryptography',
      tactic: 'Command and Control',
      description: 'Adversaries may employ a known encryption algorithm with an asymmetric key to conceal command and control traffic.',
      associatedActors: ['APT-84 (RedBanshee)'],
      associatedMalware: ['BlackVenom RAT v3.2'],
      observedCampaigns: ['Operation Arctic Ghost'],
      evidenceCount: 16,
      detectionGuidance: 'Track self-signed certificates with randomized CN fields or subject names mimicking legitimate vendor domains.'
    }
  ],
  'Exfiltration': [
    {
      id: 'T1041',
      name: 'Exfiltration Over C2 Channel',
      tactic: 'Exfiltration',
      description: 'Adversaries may steal data by exfiltrating it over an existing command and control channel rather than creating a separate dedicated exfiltration connection.',
      associatedActors: ['APT-84 (RedBanshee)', 'PhantomPanda'],
      associatedMalware: ['BlackVenom RAT v3.2'],
      observedCampaigns: ['Operation Arctic Ghost'],
      evidenceCount: 14,
      detectionGuidance: 'Flag long-duration outbound connections with heavy egress-to-ingress byte ratios exceeding 10:1.'
    }
  ]
};

