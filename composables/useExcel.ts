import moment from 'moment'
import Employer from '../models/Employer'
import WorkDay from '../models/WorkDay'

export const useExcel = (data: any) => {
    const employers = ref([])

    // Remove headers
    data.splice(0, 2);

    // Get unique dates (start and end period)
    const uniqueDates = [...new Set(data.map((item: any[]) => item[3]))];
    const startPeriod = (new Date(Math.min(...uniqueDates.map(date => new Date(date))))).toISOString().slice(0, 10);
    const endPeriod = (new Date(Math.max(...uniqueDates.map(date => new Date(date))))).toISOString().slice(0, 10);

    const excludeNames = useRuntimeConfig().public.excludeNames;

    // Group rows by name into Employer
    employers.value = data.reduce((acc: any, row: any) => {
        const name = row[1];
        const date = row[3];
        const weekday = row[4];
        const first = useTimeFormat(row[5], date, false);
        const last = useTimeFormat(row[6], date, true);
        const total = row[7];

        if (excludeNames.includes(name)) return acc;
        if (moment(endPeriod) < moment(date)) return acc;

        const workday = new WorkDay(name, date, weekday, first, last, total);

        if (!acc[name]) {
            acc[name] = new Employer(name, []);
        }

        acc[name].workdays.push(workday);

        return acc;
    }, {});

    return {
        employers,
        startPeriod,
        endPeriod,
    }
}
