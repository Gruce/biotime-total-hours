import moment from 'moment'

export const useTimeFormat = (time: any, date: any = null, out: boolean = false) => {
    if (time == 'None') return 'None';
    const cutHours = parseInt(useRuntimeConfig().public.hoursCut);
    let [hours, minutes] = time.split(':');

    if (!(moment(date).date() == 14 && out)) {
        if (moment(date).date() < 15) {
            if (parseInt(hours) - cutHours <= 0) {
                hours = parseInt(hours) - cutHours + 24
            } else {
                hours = parseInt(hours) - cutHours;
            }
        }
    }


    return moment(`${hours}:${minutes}`, 'HH:mm').format('hh:mm A');
}

