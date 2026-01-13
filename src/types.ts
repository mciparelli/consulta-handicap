import type { Client } from "@libsql/client";

export interface Env {
  LIBSQL_URL: string;
  LIBSQL_AUTH_TOKEN?: string;
  DEV?: string;
}

export interface Player {
  matricula: number;
  fullName: string;
  handicapIndex: number;
  handicapDate: string;
  clubName: string;
}

export interface PlayerWithHandicap {
  matricula: string;
  fullName: string;
  clubName: string;
  handicapIndex: number;
  handicapDate: string;
}

export interface Tarjeta {
  id: string;
  date: Date;
  cargaDate: Date;
  clubId: string;
  clubName: string;
  diferencial: number;
  score: number;
  PCC: number;
  adjustedScore: number;
  courseRating: number;
  slopeRating: number;
  is9Holes: boolean;
  processed: boolean;
  selected?: boolean;
  historica?: boolean;
}

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface HandicapRecord {
  matricula: string;
  handicapIndex: number;
  date: string;
}

export interface DbContext {
  env: Env;
  db?: Client;
}
