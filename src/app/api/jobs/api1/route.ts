import { NextRequest, NextResponse } from 'next/server';
import { Job } from '@/types/Job';
import {createMockJobs} from "@/utils/mock";

const mockJobs: Job[] = createMockJobs('api-1', 50);

export async function GET(request: NextRequest) {
    // Simulate a quick response (within timeout)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { searchParams } = new URL(request.url);
    const titleParam = searchParams.get('title')?.toLowerCase() || '';
    const locationParam = searchParams.get('location')?.toLowerCase() || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    // Validate page and limit
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;

    // Filter based on title and location
    const filteredJobs = mockJobs.filter((job) => {
        const matchesTitle = job.title.toLowerCase().includes(titleParam);
        const matchesLocation = job.location.toLowerCase().includes(locationParam);
        return matchesTitle && matchesLocation;
    });

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    // Include total count for pagination metadata
    const response = {
        total: filteredJobs.length,
        page,
        limit,
        data: paginatedJobs,
    };

    return NextResponse.json(response);
}
