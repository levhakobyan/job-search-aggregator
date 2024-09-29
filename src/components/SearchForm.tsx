'use client';

import {Form, Input, Button, Row, Col} from 'antd';

interface SearchFormProps {
    onSearch: (title: string, location: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({onSearch}: SearchFormProps) => {
    const [form] = Form.useForm();

    const handleChange = () => {
        const {title, location} = form.getFieldsValue();
        onSearch(title || '', location || '');
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleChange}>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item name="title" label="Job Title">
                        <Input placeholder="Enter job title"/>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item name="location" label="Location">
                        <Input placeholder="Enter location"/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Button id="searchJobs" type="primary" htmlType="submit" block>
                    Search
                </Button>
            </Form.Item>
        </Form>
    );
}

export default SearchForm;
