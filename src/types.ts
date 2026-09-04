export type TargetArchitecture = 'firestore' | 'postgres' | 'prisma' | 'drizzle';

export interface ColumnDefinition {
  name: string;
  legacyType: string;
  isPrimaryKey: boolean;
  isNullable: boolean;
  isIdentity: boolean;
  defaultValue?: string;
  foreignKey?: {
    targetTable: string;
    targetColumn: string;
  };
  modernType?: string;
  deprecations?: string[];
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  indexes: string[];
  primaryKeyColumns: string[];
  legacyWarnings: string[];
  notes?: string;
}

export interface SchemaAnalysis {
  tables: TableDefinition[];
  totalTables: number;
  totalColumns: number;
  antiPatterns: AntiPatternFinding[];
  cloudFreeTierScore: number; // 0 to 100
  recommendations: string[];
}

export interface AntiPatternFinding {
  id: string;
  tableName: string;
  columnName?: string;
  category: 'Deprecated Type' | 'Precision Hazard' | 'Identity Bottleneck' | 'Relational Integrity' | 'Unstructured Storage';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  remedy: string;
}

export interface MigrationProject {
  id: string;
  title: string;
  description?: string;
  originalSql: string;
  targetPlatform: TargetArchitecture;
  targetOutput: string;
  migrationScript: string;
  verificationQueries: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}
