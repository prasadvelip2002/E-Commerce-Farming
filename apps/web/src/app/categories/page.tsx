import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Fresh Vegetables',
      slug: 'Vegetable',
      icon: '🥬',
      description: 'Organic, pesticide-free vegetables harvested today.',
      color: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Seasonal Fruits',
      slug: 'Fruit',
      icon: '🥭',
      description: 'Sweet, sun-ripened fruits straight from the orchard.',
      color: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      name: 'Premium Grains',
      slug: 'Grain',
      icon: '🌾',
      description: 'High-quality wheat, rice, and millets.',
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      name: 'Authentic Spices',
      slug: 'Spice',
      icon: '🌶️',
      description: 'Aromatic spices for the perfect flavor.',
      color: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-12 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the freshest produce organized by type. Every purchase supports a verified Indian farmer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/?category=${cat.slug}`}>
              <div className={`group flex items-center p-8 rounded-3xl border-2 ${cat.borderColor} ${cat.color} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
                <div className="text-7xl mr-8 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#4A7C59] transition-colors">{cat.name}</h2>
                  <p className="text-gray-700">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
