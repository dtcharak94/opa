USE `opa`;

INSERT INTO menu
(location_id, type, date_from, date_to, flag_active, menu_items_id)
VALUES
(1, 'lunch', '2026-01-01', '2026-01-31', TRUE, 10);

commit;