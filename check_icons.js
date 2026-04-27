import * as t from '@tabler/icons-react';
const keys = Object.keys(t);
console.log('museum:', keys.filter(k => k.toLowerCase().includes('museum')));
console.log('kitchen:', keys.filter(k => k.toLowerCase().includes('kitchen')));
console.log('toilet:', keys.filter(k => k.toLowerCase().includes('toilet')));
console.log('eraser:', keys.filter(k => k.toLowerCase().includes('eraser')));
console.log('utensil:', keys.filter(k => k.toLowerCase().includes('utensil')));
