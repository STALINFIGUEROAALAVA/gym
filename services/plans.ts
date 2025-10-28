import { queryObject, queryOne } from '../db/client.ts';

export type Plan = {
  id: number;
  name: string;
  price: string; // NUMERIC llega como string
  duration_days: number;
  active: boolean;
  created_at: string;
};

export async function listPlans() {
  return await queryObject<Plan>(
    'SELECT id, name, price, duration_days, active, created_at FROM plans ORDER BY id ASC'
  );
}

export async function listActivePlans() {
  return await queryObject<Plan>(
    'SELECT id, name, price, duration_days, active, created_at FROM plans WHERE active = TRUE ORDER BY id ASC'
  );
}

export async function createPlan(input: { name: string; price: number; duration_days: number; active?: boolean }) {
  return await queryOne<Plan>(
    'INSERT INTO plans (name, price, duration_days, active) VALUES ($1, $2, $3, COALESCE($4, TRUE)) RETURNING id, name, price::text, duration_days, active, created_at',
    [input.name, input.price, input.duration_days, input.active ?? true]
  );
}