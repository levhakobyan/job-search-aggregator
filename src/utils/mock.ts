import {Job} from "@/types/Job";
import {faker} from "@faker-js/faker";


export const createMockJobs = (apiName: string, totalJobs: number): Job[] => {
    return Array.from({ length: totalJobs }, (_, index) => ({
        id: `${apiName}-${index}`,
        title: faker.person.jobTitle(),
        company: faker.company.name(),
        location: faker.location.city(),
        description: faker.lorem.paragraph(),
        salary: faker.datatype.boolean() ? `$${faker.finance.amount({min: 50000, max: 150000, dec: 0})}` : undefined,
        postedDate: faker.date.past().toISOString(),
        applicationUrl: faker.internet.url(),
    }));
}
