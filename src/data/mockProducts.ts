import { Product } from '../types/Product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'ESP32 DevKit V1 WiFi + Bluetooth Development Board',
    description: 'Dual-core WiFi + Bluetooth microcontroller with 4MB Flash, perfect for IoT projects and smart home automation.',
    price: 799,
    image: 'https://images.pexels.com/photos/442154/pexels-photo-442154.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Microcontrollers',
    stock: 45,
    rating: 4.8,
    badges: ['New', 'Best Seller'],
    countryOfOrigin: 'CN',
    protocols: ['WiFi', 'Bluetooth', 'SPI', 'I2C', 'UART'],
    useCases: ['IoT', 'Smart Home', 'Robotics'],
    keySpecs: {
      'Processor': 'Dual-core Xtensa 32-bit LX6',
      'WiFi': '802.11 b/g/n',
      'Bluetooth': 'v4.2 BR/EDR and BLE',
      'Flash': '4MB',
      'GPIO': '30 pins',
      'Operating Voltage': '3.3V'
    },
    compatibility: ['Arduino IDE', 'PlatformIO', 'ESP-IDF'],
    youtubeGuide: 'dQw4w9WgXcQ'
  },
  {
    id: '2',
    name: 'DHT22 Digital Temperature & Humidity Sensor',
    description: 'High-precision digital temperature and humidity sensor with calibrated digital signal output.',
    price: 299,
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sensors',
    stock: 128,
    rating: 4.6,
    badges: ['Popular'],
    countryOfOrigin: 'CN',
    protocols: ['Digital One-Wire'],
    useCases: ['IoT', 'Smart Home', 'Weather Station'],
    keySpecs: {
      'Temperature Range': '-40°C to 80°C',
      'Humidity Range': '0-100% RH',
      'Accuracy': '±0.5°C, ±2% RH',
      'Resolution': '0.1°C, 0.1% RH',
      'Operating Voltage': '3.3V - 5V'
    },
    compatibility: ['Arduino', 'Raspberry Pi', 'ESP32', 'ESP8266']
  },
  {
    id: '3',
    name: 'Arduino Uno R3 Development Board',
    description: 'The classic Arduino Uno R3 with ATmega328P microcontroller, perfect for beginners and prototyping.',
    price: 1299,
    image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Microcontrollers',
    stock: 67,
    rating: 4.9,
    badges: ['Best Seller'],
    countryOfOrigin: 'IN',
    protocols: ['SPI', 'I2C', 'UART', 'USB'],
    useCases: ['Education', 'Prototyping', 'Robotics'],
    keySpecs: {
      'Microcontroller': 'ATmega328P',
      'Operating Voltage': '5V',
      'Digital I/O Pins': '14',
      'Analog Input Pins': '6',
      'Flash Memory': '32KB',
      'SRAM': '2KB'
    },
    compatibility: ['Arduino IDE', 'PlatformIO', 'Various Shields']
  },
  {
    id: '4',
    name: 'Digital Multimeter with Auto-Range & True RMS',
    description: 'Professional-grade digital multimeter with auto-ranging, true RMS, and safety certifications.',
    price: 2499,
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Tools',
    stock: 23,
    rating: 4.7,
    countryOfOrigin: 'CN',
    useCases: ['Repair', 'Industrial', 'Education'],
    keySpecs: {
      'Display': '6000 counts LCD',
      'DC Voltage': '0.1mV - 1000V',
      'AC Voltage': '0.1mV - 750V',
      'DC Current': '0.1µA - 10A',
      'Resistance': '0.1Ω - 60MΩ',
      'Safety': 'CAT III 600V'
    },
    compatibility: ['Universal', 'All Electronics']
  },
  {
    id: '5',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    description: 'Accurate ultrasonic distance measurement sensor with 2cm to 400cm range.',
    price: 179,
    image: 'https://images.pexels.com/photos/442151/pexels-photo-442151.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sensors',
    stock: 89,
    rating: 4.5,
    countryOfOrigin: 'CN',
    protocols: ['GPIO Triggers'],
    useCases: ['Robotics', 'Automation', 'IoT'],
    keySpecs: {
      'Measurement Range': '2cm - 400cm',
      'Accuracy': '3mm',
      'Trigger Input': '10µS TTL pulse',
      'Echo Output': 'TTL level signal',
      'Operating Voltage': '5V DC'
    },
    compatibility: ['Arduino', 'Raspberry Pi', 'ESP32', 'Microcontrollers']
  },
  {
    id: '6',
    name: 'Raspberry Pi 4 Model B (4GB RAM)',
    description: 'Latest Raspberry Pi 4 with quad-core ARM Cortex-A72, 4GB RAM, dual 4K display output.',
    price: 6499,
    image: 'https://images.pexels.com/photos/442153/pexels-photo-442153.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Microcontrollers',
    stock: 34,
    rating: 4.9,
    badges: ['Premium'],
    countryOfOrigin: 'UK',
    protocols: ['WiFi', 'Bluetooth', 'Ethernet', 'USB', 'HDMI', 'GPIO'],
    useCases: ['IoT', 'Education', 'Automation', 'Smart Home'],
    keySpecs: {
      'Processor': 'Quad-core ARM Cortex-A72',
      'RAM': '4GB LPDDR4-3200',
      'WiFi': '802.11ac dual-band',
      'Bluetooth': '5.0, BLE',
      'Ethernet': 'Gigabit',
      'USB': '2x USB 3.0, 2x USB 2.0'
    },
    compatibility: ['Raspberry Pi OS', 'Ubuntu', 'Various Linux Distros']
  },
  {
    id: '7',
    name: 'OLED Display 0.96" I2C 128x64 Blue',
    description: 'High-contrast OLED display module with I2C interface, perfect for displaying sensor data.',
    price: 449,
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Displays',
    stock: 156,
    rating: 4.4,
    countryOfOrigin: 'CN',
    protocols: ['I2C', 'SPI'],
    useCases: ['IoT', 'Prototyping', 'Instrumentation'],
    keySpecs: {
      'Size': '0.96 inch',
      'Resolution': '128x64 pixels',
      'Colors': 'Blue monochrome',
      'Interface': 'I2C (4-pin)',
      'Operating Voltage': '3.3V - 5V'
    },
    compatibility: ['Arduino', 'ESP32', 'Raspberry Pi', 'STM32']
  },
  {
    id: '8',
    name: 'L298N Motor Driver Module',
    description: 'Dual H-bridge motor driver for controlling DC motors and stepper motors up to 2A per channel.',
    price: 299,
    image: 'https://images.pexels.com/photos/442155/pexels-photo-442155.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Components',
    stock: 78,
    rating: 4.3,
    countryOfOrigin: 'CN',
    protocols: ['GPIO Control'],
    useCases: ['Robotics', 'Automation', 'RC Projects'],
    keySpecs: {
      'Motor Voltage': '5V - 35V',
      'Logic Voltage': '5V',
      'Max Current': '2A per channel',
      'Channels': 'Dual H-bridge',
      'Protection': 'Over-current, thermal'
    },
    compatibility: ['Arduino', 'Raspberry Pi', 'Microcontrollers']
  },
  {
    id: '9',
    name: 'Breadboard 830 Points with Jumper Wires',
    description: 'High-quality solderless breadboard with 830 tie points and assorted jumper wire kit.',
    price: 249,
    image: 'https://images.pexels.com/photos/159306/circuit-circuit-board-resistor-computer-159306.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Tools',
    stock: 234,
    rating: 4.6,
    countryOfOrigin: 'CN',
    useCases: ['Prototyping', 'Education', 'Testing'],
    keySpecs: {
      'Tie Points': '830 points',
      'Size': '165 x 55 x 10mm',
      'Pitch': '2.54mm',
      'Material': 'ABS plastic',
      'Includes': '65x jumper wires'
    },
    compatibility: ['Universal', 'All Electronic Components']
  },
  {
    id: '10',
    name: 'MG995 Servo Motor High Torque',
    description: 'High-torque servo motor with metal gears, 180° rotation, perfect for robotics applications.',
    price: 599,
    image: 'https://images.pexels.com/photos/442158/pexels-photo-442158.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Components',
    stock: 67,
    rating: 4.5,
    countryOfOrigin: 'CN',
    protocols: ['PWM Control'],
    useCases: ['Robotics', 'RC Projects', 'Automation'],
    keySpecs: {
      'Torque': '8.5kg-cm at 4.8V',
      'Speed': '0.2s/60° at 4.8V',
      'Rotation': '180° ±10°',
      'Voltage': '4.8V - 7.2V',
      'Gears': 'Metal gear train'
    },
    compatibility: ['Arduino', 'Raspberry Pi', 'RC Controllers']
  },
  {
    id: '11',
    name: 'BME280 Environmental Sensor',
    description: 'Precision sensor for temperature, humidity, and barometric pressure with I2C interface.',
    price: 899,
    image: 'https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sensors',
    stock: 45,
    rating: 4.8,
    badges: ['Precision'],
    countryOfOrigin: 'DE',
    protocols: ['I2C', 'SPI'],
    useCases: ['Weather Station', 'IoT', 'Environmental Monitoring'],
    keySpecs: {
      'Temperature': '±1.0°C accuracy',
      'Humidity': '±3% RH accuracy',
      'Pressure': '±1 hPa accuracy',
      'Interface': 'I2C, SPI',
      'Operating Voltage': '1.8V - 3.6V'
    },
    compatibility: ['Arduino', 'ESP32', 'Raspberry Pi', 'STM32']
  },
  {
    id: '12',
    name: 'Soldering Iron Kit 60W with Stand',
    description: 'Complete soldering kit with temperature control, multiple tips, solder wire, and accessories.',
    price: 1299,
    image: 'https://images.pexels.com/photos/5380665/pexels-photo-5380665.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Tools',
    stock: 89,
    rating: 4.7,
    countryOfOrigin: 'CN',
    useCases: ['Repair', 'Assembly', 'Prototyping'],
    keySpecs: {
      'Power': '60W adjustable',
      'Temperature': '200°C - 450°C',
      'Heat-up Time': '2 minutes',
      'Tips': '5 different sizes',
      'Includes': 'Stand, solder wire, flux'
    },
    compatibility: ['Universal', 'All Electronic Components']
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => 
    product.category.toLowerCase().includes(category.toLowerCase())
  );
};