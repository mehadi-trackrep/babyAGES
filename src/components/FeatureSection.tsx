
import { ShieldCheckIcon, TruckIcon, ArchiveBoxIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Top selected baby products',
    description: 'No guilty feel after buying products',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Free Delivery',
    description: 'For Order over 3000 ৳*',
    icon: TruckIcon,
  },
  {
    name: 'Safe packaging',
    description: 'We ensure safe and secure packaging for all your orders.',
    icon: ArchiveBoxIcon,
  },
  {
    name: '2 days return policy',
    description: 'Not satisfied? Return it within 2 days.',
    icon: ArrowUturnLeftIcon,
  },
];

export default function FeatureSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-indigo-600">How It Works</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We provide the best products for your baby, with a focus on quality, safety, and convenience.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
