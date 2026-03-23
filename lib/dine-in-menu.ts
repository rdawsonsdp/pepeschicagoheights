import type { MenuClassification, VisualWeight } from './types';

export interface DineInMenuItem {
  name: string;
  description?: string;
  price?: string;
  classification?: MenuClassification;
  visualWeight?: VisualWeight;
  image?: string;
}

export interface DineInMenuSection {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  items: DineInMenuItem[];
}

export const DINE_IN_MENU: DineInMenuSection[] = [
  {
    id: 'appetizers',
    title: 'APPETIZERS',
    subtitle: 'Start your fiesta right',
    image: '/images/menu/steak-nachos.jpg',
    items: [
      { name: 'Botana Grande', description: 'Flautas (6) and Garnachas. Served with guacamole and sour cream', price: '15' },
      { name: 'Chile con Queso', description: 'Delicious tangy sauce & melted cheese w/ chips. Spicy jalapeno, corn or flour tortilla. Extra Cheese $2', price: '11' },
      { name: 'Guacamole', description: 'Half or Full order', price: 'Market Price' },
      { name: 'Queso Blanco', description: 'Add Ground Beef +$2.35', price: '7' },
      { name: 'Stuffed Nachos', description: 'Queso Blanco or melted Chihuahua and cheddar cheese. Comes with beans, guacamole and sour cream', price: '13' },
      { name: 'Queso Blanco Burrito', description: 'Beef, chicken, pork, or steak topped with queso blanco and pico de gallo', price: '15' },
      { name: 'Jalapeño Poppers', price: '9' },
    ],
  },
  {
    id: 'nachos',
    title: 'NACHOS',
    subtitle: 'Fresh chips, pico de gallo, melted cheese or cheese sauce, fried beans, guacamole & sour cream',
    image: '/images/menu/steak-nachos.jpg',
    items: [
      { name: 'Regular', price: '11' },
      { name: 'Beef, Chicken, Pork, or Steak', price: '14' },
      { name: 'Steak Fajita, Chicken Fajita, Grilled Chicken, Carnitas, or Chorizo', price: '16' },
    ],
  },
  {
    id: 'quesadillas',
    title: 'QUESADILLAS',
    subtitle: 'Large flour tortilla and pico de gallo filled with Chihuahua cheese, served with sour cream & guacamole',
    image: '/images/menu/quesadilla-real.jpg',
    items: [
      { name: 'Cheese', price: '11' },
      { name: 'Beef, Chicken, Pork, Steak or Grilled Chicken', price: '13' },
      { name: 'Steak Fajita, Chicken Fajita, Grilled Chicken, Carnitas, or Chorizo', price: '16' },
      { name: 'Add to Make it a Dinner with Rice/Beans', price: '+$3' },
    ],
  },
  {
    id: 'tacos',
    title: 'TACOS',
    subtitle: 'Your choice of flour tortilla or soft/crispy corn with lettuce, cheese, and tomato',
    image: '/images/menu/tacos-header.jpg',
    items: [
      { name: 'Beef Taco', description: 'Stuffed taco w/ melted cheese in between tortilla + $.50 per taco. $.50 Extra Sour Cream (per taco) $.75 Extra Guacamole (per taco)', price: '4' },
      { name: 'Chicken Taco', description: 'Stuffed taco w/ melted cheese in between tortilla + $.50 per taco. $.50 Extra Sour Cream (per taco) $.75 Extra Guacamole (per taco)', price: '4' },
      { name: 'Pork Taco', description: 'Stuffed taco w/ melted cheese in between tortilla + $.50 per taco. $.50 Extra Sour Cream (per taco) $.75 Extra Guacamole (per taco)', price: '4' },
      { name: 'Street Steak Corn Taco (1)', description: 'Topped with Pico de Gallo & Corn', price: '5' },
      { name: 'Steak or Chicken Fajita (2)', price: '11' },
      { name: 'Steak or Chorizo (1)', price: '4.50' },
      { name: 'Quesabirria Tacos (3)', description: 'Shredded beef topped with cheese, onion, cilantro and side of beef broth', price: '13.99' },
      { name: 'Veggie or Guacamole (1)', price: '5' },
      { name: 'Tilapia (2)', price: '11' },
      { name: 'Order (3) Tacos and Make it a Dinner w/ Rice/Beans', price: '+$3' },
    ],
  },
  {
    id: 'burritos',
    title: 'BURRITOS',
    subtitle: 'Your choice of Regular, Suizo (melted cheese & ranchera sauce), or Frito (deep fried). Make it a dinner with rice & beans +$3',
    image: '/images/menu/burrito-real.jpg',
    items: [
      { name: 'Beef, Chicken, Pork, Vegetable, All Bean, or Egg Don Pepe', price: '10' },
      { name: 'All Meat (No Beans)', price: '12' },
      { name: 'Steak, Chicken or Steak Fajita, Shrimp, Tilapia, Carnitas, Chile Relleno, or Chorizo and Egg', price: '14' },
      { name: 'Chicken or Steak Fajita, Shrimp, Tilapia, or Carnitas', description: 'Topped with queso blanco and pico de gallo', price: '17' },
      { name: 'Queso Blanco Burrito - Beef, Chicken, Pork, or Steak', description: 'Topped with queso blanco and pico de gallo', price: '15' },
    ],
  },
  {
    id: 'traditionals',
    title: 'TRADITIONALS',
    subtitle: 'Served with your choice of beef, chicken, or pork and a side of rice & beans, unless noted. Add Steak for $1.50 per item',
    items: [
      { name: 'Burrito Bowl', description: 'Choice of white or Spanish rice, pinto or black beans, homemade red or green sauce, steak or chicken, cheddar or Chihuahua cheese, guacamole, sour cream, lettuce and pico de gallo', price: '14' },
      { name: 'Chicken Breast Dinner', description: 'Comes with white rice and a vegetable medley', price: '16' },
      { name: 'Chicken en Mole', description: 'Chicken breast simmered in mole sauce', price: '16' },
      { name: 'Chile Relleno Dinner (2)', description: 'Deep-fried poblano pepper stuffed with cheese, corn or flour tortillas', price: '18' },
      { name: 'Enchilada Dinners (3) - Poblana, Suizas, Salsa Verde or Roja', price: '15' },
      { name: 'Enchilada Dinners - Cozumel', price: '16' },
      { name: 'Enchilada Dinners - Spinach & Grilled Chicken', price: '16' },
      { name: 'Flauta Dinner (3)', description: 'Beef or chicken', price: '14' },
      { name: 'Guisado de Res o Puerco', description: 'Beef or Pork', price: '16' },
      { name: 'Milanesa de Pollo', description: 'Breaded Chicken', price: '16' },
      { name: 'Taco Salad', description: 'Served with lettuce, tomato, cheese, onions, green peppers (rice & beans not included)', price: '12' },
      { name: 'Torta Dinner (1)', description: 'Steak or Milanesa de Pollo. Garnished with guacamole, fried beans, lettuce, sliced tomato, onions, and sour topping', price: '14' },
      { name: 'Tostada Dinners (2) - Regular', price: '13' },
      { name: 'Tostada Dinners (2) - Suiza', price: '14' },
    ],
  },
  {
    id: 'combos',
    title: 'COMBOS',
    subtitle: 'Served with your choice of beef, chicken, or pork and rice & beans. Fries substitute +$1.50. Steak add-on +$1.50 per item',
    image: '/images/menu/combos-greenchili.jpg',
    items: [
      { name: 'Sonora', description: 'Taco, Enchilada with beef/chicken/pork, rice & beans', price: '14' },
      { name: 'Pinata', description: 'Taco, Tostada, Tamale with beef/chicken/pork, rice & beans', price: '15' },
      { name: 'Azteca', description: 'Taco, Tostada, Flauta with beef/chicken/pork, rice & beans', price: '15' },
      { name: 'Mayan', description: 'Taco, Enchilada Suiza, Tostada Suiza with beef/chicken/pork, rice & beans', price: '16' },
      { name: 'Fiesta', description: 'Taco, Enchilada Suiza, Tostada, Tamale with beef/chicken/pork, rice & beans', price: '17' },
      { name: 'Puebla', description: 'Chile Relleno, Taco, Tamale with beef/chicken/pork, rice & beans', price: '18' },
    ],
  },
  {
    id: 'fajitas',
    title: 'FAJITAS',
    subtitle: 'Served with sauteed onions, peppers and tomato, rice, beans, guacamole, pico de gallo, shredded cheese and sour cream',
    image: '/images/menu/fajitas-carne-asada.jpg',
    items: [
      { name: 'Veggie Fajita', description: 'Sautéed onions, peppers, tomato with rice, beans, guacamole, pico de gallo, cheese, sour cream', price: '20' },
      { name: 'Individual Fajita', description: 'Steak, chicken, chorizo, carnitas, shrimp, or spinach with tortilla, pico de gallo, chihuahua cheese, sour cream, guacamole', price: '15' },
      { name: 'Pepe\'s Fajita Combo', description: 'Steak / Chicken / Shrimp with sautéed vegetables, rice, beans, guacamole, pico de gallo, cheese, sour cream', price: '29.95' },
      { name: 'Loaded Fajita Nachos', description: 'Fresh chips, pico de gallo, melted cheese, fried beans, guacamole, sour cream', price: '16' },
    ],
  },
  {
    id: 'mariscos',
    title: 'MARISCOS',
    subtitle: 'Seafood - Served with rice & salad and your choice of corn or flour tortilla',
    image: '/images/menu/red-snapper.jpg',
    items: [
      { name: 'Camarones a la Diabla', description: 'Sauteed in spicy sauce', price: '21' },
      { name: 'Camarones a la Plancha', description: 'Served on a bed of lettuce and avocado slices', price: '21' },
      { name: 'Huachinango', description: 'Deep-fried red snapper', price: '26' },
      { name: 'Shrimp Ceviche', description: 'Shrimp, pico de gallo, lime, avocado slices', price: '15.99' },
      { name: 'Shrimp Cocktail', price: '16' },
      { name: 'Tilapia (2)', price: '11' },
    ],
  },
  {
    id: 'asador',
    title: 'ASADOR',
    subtitle: 'From the Grill - Served with a side of rice & beans and your choice of soft corn or flour tortilla',
    items: [
      { name: 'Carne Asada', description: 'Broiled skirt steak. Tender, juicy, and flavorful', price: '28' },
      { name: 'Carne Asada Especial', description: 'Broiled skirt steak and chile relleno', price: '31' },
      { name: 'Carne Asada Jalisco', description: 'Broiled skirt steak with black beans, chile de arbol sauce, and mini cheese quesadilla', price: '28' },
      { name: 'Carne Asada a la Tampiqueña', description: 'Broiled skirt steak served with choice of taco, tostada suiza, enchilada suiza, flauta, tostada, or tamale', price: '29.95' },
      { name: 'Pancho Villa', description: 'Broiled skirt steak with lime, onions, avocado, and pico de gallo', price: '26.95' },
      { name: 'Tierra Y Mar', description: 'Broiled skirt steak & sauteed shrimp', price: '30' },
    ],
  },
  {
    id: 'american-fare',
    title: 'AMERICAN FARE',
    image: '/images/menu/american-fare-burger.jpg',
    items: [
      { name: 'Grande Burger Deluxe', description: '1/3 lb Hamburger, Lettuce, Tomato, Cheese, and Onion with a Side of French Fries', price: '10' },
      { name: 'Cheese Fries', description: 'Our Classic Cheese Fries', price: '5' },
      { name: 'Onion Rings', description: 'Crispy Onion Rings', price: '4' },
      { name: 'Pepe\'s Wings (12PC)', description: 'Pepe\'s Wings w/Buffalo Sauce', price: '15' },
      { name: 'Pepe\'s Wings (20PC)', price: '20' },
      { name: 'French Fries', price: '4' },
    ],
  },
  {
    id: 'kids-menu',
    title: 'KIDS MENU',
    subtitle: '10 and under. Includes French fries or Rice / Beans',
    items: [
      { name: 'Chicken Fingers (3)', price: '7.95' },
      { name: 'Hot Dog', price: '7.95' },
      { name: 'Quesadilla', price: '7.95' },
      { name: 'Taco (1) Soft or Crispy', description: 'Beef or Chicken', price: '7.95' },
      { name: 'Taquitos (4) Beef or Cheese', price: '7.95' },
    ],
  },
  {
    id: 'a-la-carte',
    title: 'A LA CARTE',
    subtitle: 'Available in beef, chicken, or pork. Add Steak +$1.50 per item',
    image: '/images/menu/enchiladas-poblanas.jpg',
    items: [
      { name: 'Chile Relleno', price: '9' },
      { name: 'Enchilada Poblana', price: '5' },
      { name: 'Enchilada Red or Green', price: '5' },
      { name: 'Enchilada Suiza', price: '5' },
      { name: 'Flauta', price: '4' },
      { name: 'Sopas', price: '5' },
      { name: 'Tamale', price: '4' },
      { name: 'Tostada', price: '4' },
      { name: 'Tostada Suiza', price: '5' },
    ],
  },
  {
    id: 'side-orders',
    title: 'SIDE ORDERS',
    image: '/images/menu/sides-real.jpg',
    items: [
      { name: 'Avocado', price: '4' },
      { name: 'Cheese', price: '2' },
      { name: 'Cheese Sauce', price: '3' },
      { name: 'Chiles Asados', price: '3' },
      { name: 'Chile Relleno', price: '9' },
      { name: 'Cup of Shredded Cheese', price: '2' },
      { name: 'Flauta', price: '4' },
      { name: 'Green or Red Enchilada', price: '5' },
      { name: 'Green or Red Sauce (4oz)', price: '2' },
      { name: 'Guacamole (4oz)', price: '6' },
      { name: 'Jalapeno Poppers', price: '9' },
      { name: 'Large Chips', price: '5' },
      { name: 'Large Cup of Beans', price: '3.50' },
      { name: 'Large Rice', price: '3.50' },
      { name: 'Mexican Rice', price: '3.50' },
      { name: 'Pico de Gallo', price: '3' },
      { name: 'Pint of Beans', price: '7' },
      { name: 'Pint of Guacamole', price: '22' },
      { name: 'Pint of Rice', price: '7' },
      { name: 'Side of Black Beans', price: '5' },
      { name: 'Sour Cream', price: '2' },
      { name: 'Tamale', price: '4' },
      { name: 'Tortilla (4)', price: '2' },
      { name: 'Tostada', price: '4' },
      { name: 'Tostada Suiza', price: '5' },
    ],
  },
  {
    id: 'postres',
    title: 'POSTRES',
    subtitle: 'Desserts',
    image: '/images/menu/desserts-real.jpg',
    items: [
      { name: 'Churros (2)', description: 'Served with Caramel', price: '9' },
      { name: 'Flan', price: '7' },
      { name: 'Fried Ice Cream', price: '7' },
      { name: 'Mexican Tiramisu', price: '8' },
    ],
  },
  {
    id: 'margaritas',
    title: 'MARGARITAS',
    image: '/images/menu/strawberry-marg-real.jpg',
    items: [
      { name: 'Flavored Margaritas', description: 'Mezcal, Triple Sec, Lime juice. Available Frozen or On the Rocks. Fresa melt +$2. Strawberry, Mango, Passion Fruit, Cucumber/Chamoy, Banana, Guava, Peach, Wildberry, Pomegranate, Blackberry, Jalapeno, Mamma Melon, Blue Hawaiian, Blue Curacao', price: '$8 / 16oz $13 / Pitcher $26' },
      { name: 'Skinny Margarita', description: 'Maestro Dovel Blanco', price: '$9 / 16oz $14' },
      { name: 'Keto Skinny Margarita', description: 'Maestro Dovel Blanco', price: '16oz $12 / 45oz $27 / 60oz $36' },
      { name: 'Corona Rita', description: '16oz. Add Flavor +$3', price: '17' },
      { name: 'Specialty Margaritas', description: 'Cadillac, Golden', price: '16oz $16 / 60oz $40 / Pitcher $36' },
      { name: 'Superman Margarita or Canchita Rita', price: '16oz $16 / 45oz $35' },
      { name: 'Premium Margarita', price: '16oz $18 / 45oz $35 / 60oz $38' },
      { name: 'Perman Margarita', price: '60oz $40 / Pitcher $36' },
    ],
  },
  {
    id: 'cocktails',
    title: 'COCKTAILS',
    image: '/images/menu/tequila-real.jpg',
    items: [
      { name: 'Cantarito', description: 'Maestro Dovel Blanco, lime juice, lemon juice, grapefruit juice, squirt, rim', price: '13' },
      { name: 'Dirty Horchata', description: 'Horchata, Tito\'s, Kahlua, coffee, cinnamon', price: '13' },
      { name: 'Don Mojito', description: 'Rum, mint, fresh cucumber juice, lime juice, simple syrup, mint, club soda', price: '13' },
      { name: 'Island Pina Coladas, Daiquiris', description: 'Tequila Sunrises / 45oz $27 / 60oz $36 / Pitcher $33', price: '11' },
      { name: 'Jalisco Old Fashion', description: 'Mezcal, tequila, agave, apple, orange bitters, soda', price: '13' },
      { name: 'La Playa', description: 'Tito\'s, triple sec, lime, cranberry', price: '13' },
      { name: 'Mezcal Pineapple & Jalapeno', description: 'Mezcal, triple sec, lime juice, pineapple juice', price: '13' },
      { name: 'Mexican Mule', description: 'Mezcal, lime juice, ginger beer', price: '13' },
      { name: 'Michelada 27oz', description: 'Blanco. Lime Juice, Squirt, salted rim', price: '9' },
      { name: 'Mimosas', price: '6' },
      { name: 'Paloma', description: 'Maestro Dovel Blanco, Lime Juice, Squirt, salted rim', price: '11' },
      { name: 'Ranch Water', description: 'Maestro Dovel Blanco, lime juice, soda water', price: '13' },
      { name: 'Sangria 16oz', price: '11' },
      { name: 'Strawberry Paloma', description: 'Maestro Dovel Blanco, lime juice, strawberry', price: '13' },
    ],
  },
  {
    id: 'shots',
    title: 'SHOTS',
    image: '/images/menu/tequila-real.jpg',
    items: [
      { name: 'Jose Cuervo', price: '8' },
      { name: 'Jose Cuervo Silver', price: '8' },
      { name: 'Don Julio', price: '9' },
      { name: 'Gran Centenario', price: '9' },
      { name: 'Patron Silver', price: '9.50' },
      { name: '1800', price: '10' },
      { name: 'Sargardo', price: '11' },
      { name: 'Casamigos', price: '13' },
      { name: 'Cabo Wabo', price: '16' },
      { name: 'Clase Azul', price: '18' },
      { name: 'Top Shelf', price: '19' },
    ],
  },
  {
    id: 'beer',
    title: 'BEER',
    image: '/images/menu/beer-real.jpg',
    items: [
      { name: 'Draft Beer', description: 'Ask server for selection', price: '20oz $4 / Pitcher $20' },
      { name: 'Beer Flight', description: '(5oz) 5 for', price: '18' },
      { name: 'Domestic Bottled', description: 'Bud Light, Coors Light, Miller Lite, MGD, Truly', price: '5' },
      { name: 'Import Bottled', description: 'Corona, Modelo, Stella, Pacifico', price: '6' },
    ],
  },
  {
    id: 'wine-beverages',
    title: 'WINE & BEVERAGES',
    image: '/images/menu/strawberry-marg-real.jpg',
    items: [
      { name: 'Wine', description: 'Sangria, Merlot, Chardonnay, Pinot Noir, White Zinfandel', price: '9' },
      { name: 'Seltzers', description: 'White Claw / Truly', price: '6.50' },
      { name: 'Lemonade Refresher', price: '6' },
      { name: 'Mexican Bottle', price: '6' },
      { name: 'White Claw', price: '6' },
      { name: 'Seltzer', price: '6' },
      { name: 'Non Alcoholic Beer', description: 'Douls, Miller, Heineken or Budweiser', price: '5' },
    ],
  },
];

// Special info items (not menu items but promotions)
export const DINE_IN_PROMOS = [
  { title: 'Happy Hour', description: 'Monday-Friday 3pm-7pm. Wine $1 Off, Beer $1 Off, Cocktails $1.50 Off' },
  { title: 'Taco Tuesday', description: 'All Tacos $2' },
];

// Helper to group sections into food and drinks
export const FOOD_SECTIONS = [
  'appetizers', 'nachos', 'quesadillas', 'tacos', 'burritos', 'traditionals', 'combos', 'fajitas', 'mariscos', 'asador', 'american-fare', 'kids-menu', 'a-la-carte', 'side-orders', 'postres',
];

export const DRINK_SECTIONS = [
  'margaritas', 'cocktails', 'shots', 'beer', 'wine-beverages',
];
