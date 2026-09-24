import { AttackTechnique } from '@/types/cti';
import { mockAttackMatrix } from '@/lib/mock-data/attack';

export class MitreAttackService {
  private matrix: Record<string, AttackTechnique[]> = mockAttackMatrix;

  public getMatrix(): Record<string, AttackTechnique[]> {
    return this.matrix;
  }

  public getTechniqueById(id: string): AttackTechnique | null {
    const cleanId = id.trim().toUpperCase();
    for (const tactic of Object.keys(this.matrix)) {
      const found = this.matrix[tactic].find(t => t.id.toUpperCase() === cleanId);
      if (found) return found;
    }
    return null;
  }

  public correlateByObservable(observable: {
    type: string;
    ports?: number[];
    cve?: string;
    malwareFamily?: string;
    keywords?: string[];
  }): AttackTechnique[] {
    const matched: AttackTechnique[] = [];
    const seen = new Set<string>();

    const addTech = (t: AttackTechnique) => {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        matched.push(t);
      }
    };

    // If CVE is present, Initial Access T1190 is correlated
    if (observable.cve || observable.type === 'cve') {
      const t1190 = this.getTechniqueById('T1190');
      if (t1190) addTech(t1190);
    }

    // If HTTPS or standard C2 ports 8443, 443, 8080 are observed
    if (observable.ports?.some(p => [443, 8443, 8080, 80].includes(p)) || observable.type === 'ip') {
      const t1071 = this.getTechniqueById('T1071.001');
      if (t1071) addTech(t1071);
    }

    // If Domain or URL is observed (Phishing / Ingress)
    if (observable.type === 'domain' || observable.type === 'url') {
      const t1566 = this.getTechniqueById('T1566.002');
      if (t1566) addTech(t1566);
    }

    // If Malware family BlackVenom or CobaltLoader is observed
    if (observable.malwareFamily?.toLowerCase().includes('blackvenom')) {
      const t1059 = this.getTechniqueById('T1059.001');
      const t1055 = this.getTechniqueById('T1055.012');
      const t1027 = this.getTechniqueById('T1027.002');
      if (t1059) addTech(t1059);
      if (t1055) addTech(t1055);
      if (t1027) addTech(t1027);
    }

    // Default to at least Initial Access and C2 if none matched yet
    if (matched.length === 0) {
      const t1190 = this.getTechniqueById('T1190');
      const t1071 = this.getTechniqueById('T1071.001');
      if (t1190) addTech(t1190);
      if (t1071) addTech(t1071);
    }

    return matched;
  }
}

export const mitreAttackService = new MitreAttackService();
