import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const residents = await prisma.resident.findMany({
      select: {
        id: true,
        namaWarga: true,
        nomorRumah: true,
        blok: true,
        noTelp: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { nomorRumah: 'asc' },
        { namaWarga: 'asc' },
      ],
    });

    // Transform data to match expected interface
    const transformedResidents = residents.map(resident => ({
      id: resident.id,
      name: resident.namaWarga,
      houseNumber: resident.nomorRumah,
      block: resident.blok,
      phone: resident.noTelp,
      email: resident.profile?.email || '',
      profileId: resident.profile?.id,
    }));

    return NextResponse.json(transformedResidents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch residents' },
      { status: 500 }
    );
  }
}
