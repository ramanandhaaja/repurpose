import { prisma } from '@/app/lib/prisma'

export async function getProducts() {
    try {
        const products = await prisma.products.findMany({
            include: {
                category: true
            }
        })
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}
