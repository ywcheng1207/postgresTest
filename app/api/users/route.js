import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, email } = await req.json();
    await prisma.user.create({ data: { name, email } });
    return NextResponse.json({ message: 'success', data: { name, email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: `DELETE ${id}` }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}