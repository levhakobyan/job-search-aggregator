'use client';

import { useEffect, useMemo, useState } from 'react';
import { Layout, Typography, Spin, Alert } from 'antd';
import { Job } from '@/types/Job';
import SearchForm from '../components/SearchForm';
import JobList from '../components/JobList';
import { useFavoritesStore } from '@/context/favoritesStore';
import useSWR from 'swr';

const { Header, Content } = Layout;
const { Title } = Typography;

type FilterForm = {
    title: string,
    location: string
}

export default function Home() {
    const [filter, setFilter] = useState<FilterForm>({
        title: '',
        location: ''
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10
    })

    const [loadedJobs, setLoadedJobs] = useState<Job[]>([]);

    const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

    const fetcher = async () => {
        const res = await fetch(
            `/api/jobs?title=${encodeURIComponent(filter.title)}&location=${encodeURIComponent(filter.location)}&page=${pagination.page}&limit=${pagination.limit}`
        );

        return await res.json();
    }

    const { data, error, isLoading: loading } = useSWR('jobs' + filter.title + filter.location + pagination.page, fetcher)

    useEffect(() => {
        if (!data) {
            return;
        }

        if (pagination.page === 1) {
            setLoadedJobs(data.jobs);
        } else {
            setLoadedJobs(prev => [...prev, ...data.jobs]);
        }
    }, [data]);

    const hasMore = useMemo(() => data ? loadedJobs.length < data?.total : loading, [loadedJobs, data]);

    const handleSearch = (title: string, location: string) => {
        // Reset state and start new search
        setLoadedJobs([]);
        setPagination(prev => ({ ...prev, page: 1 }));
        setFilter({ title, location });
    };

    const loadMoreJobs = () => {
        setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    };

    const handleFavoriteToggle = (job: Job) => {
        if (favorites.some((fav) => fav.id === job.id)) {
            removeFavorite(job.id);
        } else {
            addFavorite(job);
        }
    };

    return (
        <Layout>
            <Header style={{ backgroundColor: '#1890ff' }}>
                <Title level={2} style={{ color: 'white', margin: '14px 0' }}>
                    Job Search Aggregator
                </Title>
            </Header>
            <Content style={{ padding: '20px' }}>
                <SearchForm onSearch={handleSearch} />
                {error && <Alert message={error.message} type="error" showIcon />}

                {loading && pagination.page === 1 ? <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
                    : <JobList
                        jobs={loadedJobs}
                        hasMore={hasMore}
                        loadMoreJobs={loadMoreJobs}
                        onFavoriteToggle={handleFavoriteToggle}
                        favorites={favorites}
                    />
                }

            </Content>
        </Layout>
    );
}
