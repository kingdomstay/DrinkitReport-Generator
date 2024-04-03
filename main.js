

window.onload = () => {
    var clipboard = new ClipboardJS('.btn');

    /*clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
    });

    clipboard.on('error', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
    });*/

    const apiUrl = "https://drinkit-mobile-api.drinkit.dodois.io/motivation/v2/GetMotivationBoard?countryId=643&unitId="
    const motivationsUUID = ["fe009d98-f69b-87a0-11ed-6a59445cf1ff", "5a049489-6823-9bcb-11ee-891a4aac5635"]

    const formValues = document.forms.form

    const form = document.querySelector('.form')
// const coffeePlaceInput = form.querySelector('input[name="coffePlace"]:checked')
    const earnMoneyInput = document.getElementById('earnMoney')
    const countOrdersInput = document.getElementById('countOrders')
    const averageBillInput = document.getElementById('averageBill')
    const newGuestsInput = document.getElementById('newGuests')
    const oldGuestsInput = document.getElementById('oldGuests')

    const countLikesInput = document.getElementById('countLikes')
    const countDislikesInput = document.getElementById('countDislikes')
    const averageSpeedInput = document.getElementById('averageSpeed')
    const longOrdersInput = document.getElementById('longOrders')

    function loadForm() {

    }

    function toHHMMSS (time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return `${minutes}:${seconds}`;
    }

    function selectPlace() {
        formValues.coffeePlace.forEach(radio => {
            radio.addEventListener('change', () => {
                fetch(`${apiUrl}${motivationsUUID[parseInt(formValues.coffeePlace.value)]}`).then(function (response) {
                    response.json().then(function (data) {
                        console.log(data)
                        countLikesInput.value = data.orderRatingCounter.likeCount
                        countDislikesInput.value = data.orderRatingCounter.dislikeCount
                        averageSpeedInput.value = toHHMMSS(data.yesterdayCounter.readySecondsAvg)
                        longOrdersInput.value = data.todayCounter
                    });
                });
            })
        });
    }

    function generateText() {
        // TODO
    }

    function validateForm() {

    }

    selectPlace()
}
