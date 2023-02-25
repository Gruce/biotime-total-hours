import moment from 'moment'

export const useTimeFormat = (time: any) => {
    if (time == 'None') return 'None';
    const cutHours = parseInt(useRuntimeConfig().public.hoursCut);
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours) - cutHours;
    return moment(`${hours}:${minutes}`, 'HH:mm').format('hh:mm A');
}

