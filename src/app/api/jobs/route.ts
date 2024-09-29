import {NextRequest, NextResponse} from 'next/server';
import {Job} from '@/types/Job';
import {PaginatedResponse} from "@/types/PaginatedResponse";

const TIMEOUT = 2000; // Timeout in milliseconds

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const title = searchParams.get('title') || '';
    const location = searchParams.get('location') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    // Validate page and limit
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;

    const getLimit = (n: number, limit: number, count: number) => {
        // Calculate a fair share of the limit for each third party
        const baseLimit = Math.floor(limit / count);

        // Distribute the remaining limit if `limit` is not perfectly divisible
        const remainder = limit % count;

        // Add 1 to the limit for the first `remainder` third parties
        return n < remainder ? baseLimit + 1 : baseLimit;
    };

    const baseUrl = `${request.nextUrl.origin}/api/jobs`;

    const getEndpoint = (apiName: string, index: number, totalLimit: number, thirdPartiesCount: number) => {
        const _limit = getLimit(index, totalLimit, thirdPartiesCount)
        const queryParams = `?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}&page=${page}&limit=${_limit}`;

        return `${baseUrl}/${apiName}${queryParams}`;
    }

    const jobApis = ['api1', 'api2', 'api3'].map((item, index, arr) => getEndpoint(item, index, limit, arr.length))

    try {
        const fetchJobsPromises = jobApis.map((apiUrl) => {
            return new Promise<PaginatedResponse<Job>>((resolve) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => {
                    controller.abort();
                    resolve(new PaginatedResponse()); // Resolve with empty array on timeout
                }, TIMEOUT);

                fetch(apiUrl, {signal: controller.signal})
                    .then((res) => {
                        clearTimeout(timeoutId);
                        if (!res.ok) {
                            resolve(new PaginatedResponse()); // Resolve with empty array on error
                        } else {
                            return res.json();
                        }
                    })
                    .then((response) => {
                        if (response) {
                            resolve(response); // Extract jobs array from the response
                        } else {
                            resolve(new PaginatedResponse());
                        }
                    })
                    .catch(() => {
                        clearTimeout(timeoutId);
                        resolve(new PaginatedResponse()); // Resolve with empty array on fetch error
                    });
            });
        });

        // Wait for all promises to settle
        const results = await Promise.all(fetchJobsPromises);
        const allJobs = results.map(e => e.data).flat();

        // Implement pagination on the aggregated results
        const total = results.map(r => r.total).reduce((acc, curr) => acc + curr, 0);
        // const startIndex = (page - 1) * limit;
        // const endIndex = startIndex + limit;
        // const paginatedJobs = allJobs.slice(startIndex, endIndex);

        const response = {
            total,
            page,
            limit,
            jobs: allJobs,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Failed to fetch jobs'}, {status: 500});
    }
}
