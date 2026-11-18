INSERT INTO cafeteria (
  id, nombre, slogan, descripcion, historia, direccion, telefono, correo,
  horarios, whatsapp, instagram, facebook, video_url, video_poster,
  video_credit, video_credit_url
) VALUES (
  1,
  'CoffeeHouse',
  'El mejor café de la ciudad',
  'Café de especialidad, buena conversación y algo rico para acompañar cada momento.',
  'Este texto es de ejemplo. Reemplázalo por la historia real de tu cafetería desde MySQL.',
  'Actualiza esta dirección en MySQL',
  NULL,
  NULL,
  'Actualiza los horarios en MySQL',
  NULL,
  NULL,
  NULL,
  'https://videos.pexels.com/video-files/13736675/13736675-uhd_1440_2560_24fps.mp4',
  'https://images.pexels.com/videos/13736675/adolescence-adult-apron-bar-13736675.jpeg?auto=compress&cs=tinysrgb&w=1800',
  'Video: Mizuno K / Pexels',
  'https://www.pexels.com/video/a-barista-serving-a-cup-of-coffee-13736675/'
)
ON DUPLICATE KEY UPDATE id = VALUES(id);

INSERT INTO servicios (nombre, descripcion, icono, orden) VALUES
  ('Café para llevar', 'Preparamos tu bebida favorita para acompañarte donde vayas.', '↗', 1),
  ('Un espacio para compartir', 'Mesas cómodas para reunirte, conversar o hacer una pausa.', '⌂', 2),
  ('Pedidos para eventos', 'Opciones de café y bocados para tus reuniones especiales.', '✳', 3);

INSERT INTO productos_cafeteria (titulo, descripcion, imagen, precio, categoria, destacada, orden) VALUES
  ('Espresso de la casa', 'Café de especialidad, intenso y con notas de chocolate.', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=900', 18.00, 'Café', 1, 1),
  ('Latte cremoso', 'Espresso doble con leche texturizada y un acabado suave.', 'https://images.pexels.com/photos/5373256/pexels-photo-5373256.jpeg?auto=compress&cs=tinysrgb&w=900', 25.00, 'Café', 1, 2),
  ('Cold brew', 'Café infusionado en frío, refrescante y naturalmente dulce.', 'https://images.pexels.com/photos/27860686/pexels-photo-27860686.jpeg?auto=compress&cs=tinysrgb&w=900', 24.00, 'Fríos', 1, 3),
  ('Croissant de mantequilla', 'Hojaldre dorado, horneado para disfrutar junto a tu café.', 'https://images.pexels.com/photos/28298535/pexels-photo-28298535.jpeg?auto=compress&cs=tinysrgb&w=900', 16.00, 'Panadería', 0, 4);

INSERT INTO galeria (imagen, texto_alternativo, descripcion, orden) VALUES
  ('https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Taza de café de especialidad', 'Café preparado al momento', 1),
  ('https://images.pexels.com/photos/5373256/pexels-photo-5373256.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Interior cálido de una cafetería', 'Un espacio para quedarse', 2),
  ('https://images.pexels.com/photos/36729751/pexels-photo-36729751.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Clientes compartiendo en una cafetería', 'Cada taza, hecha con cuidado', 3);
