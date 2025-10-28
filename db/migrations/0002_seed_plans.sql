-- Seed inicial de planes. Inserta si no existen por nombre.
INSERT INTO plans (name, price, duration_days, active)
SELECT 'Mensual', 30.00, 30, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Mensual');

INSERT INTO plans (name, price, duration_days, active)
SELECT 'Trimestral', 80.00, 90, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Trimestral');

INSERT INTO plans (name, price, duration_days, active)
SELECT 'Anual', 300.00, 365, TRUE
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Anual');