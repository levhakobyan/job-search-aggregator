'use client';

import { List, Card, Spin, Button } from 'antd';
import { Job } from '../types/Job';
import InfiniteScroll from 'react-infinite-scroll-component';

interface JobListProps {
    jobs: Job[];
    hasMore: boolean;
    loadMoreJobs: () => void;
    onFavoriteToggle: (job: Job) => void;
    favorites: Job[];
}

export default function JobList({
                                    jobs,
                                    hasMore,
                                    loadMoreJobs,
                                    onFavoriteToggle,
                                    favorites,
                                }: JobListProps) {
    return (
        <InfiniteScroll
            dataLength={jobs.length}
            next={loadMoreJobs}
            hasMore={hasMore}
            loader={<Spin size="large" style={{ display: 'block', margin: '20px auto' }} />}
            endMessage={<p style={{ textAlign: 'center' }}>No more jobs to display</p>}
        >
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={jobs}
                renderItem={(job) => {
                    const isFavorite = favorites.some((fav) => fav.id === job.id);

                    return (
                        <List.Item key={job.id}>
                            <Card
                                title={`${job.title} at ${job.company}`}
                                extra={
                                    <Button
                                        type={isFavorite ? 'primary' : 'default'}
                                        onClick={() => onFavoriteToggle(job)}
                                    >
                                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </Button>
                                }
                            >
                                <p>
                                    <strong>Location:</strong> {job.location}
                                </p>
                                <p>{job.description}</p>
                                <Button type="link" href={job.applicationUrl} target="_blank">
                                    Apply Now
                                </Button>
                            </Card>
                        </List.Item>
                    );
                }}
            />
        </InfiniteScroll>
    );
}
