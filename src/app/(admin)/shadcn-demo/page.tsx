import ShadcnDemo from "@/components/demo/ShadcnDemo";

export default function ShadcnDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        shadcn/ui Demo
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Testing shadcn/ui components integration
                    </p>
                </div>
                <ShadcnDemo />
            </div>
        </div>
    );
}
