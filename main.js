const apiUrl = "https://drinkit-mobile-api.drinkit.dodois.io/motivation/v2/GetMotivationBoard?countryId=643&unitId="
const motivationsUUID = ["fe009d98-f69b-87a0-11ed-6a59445cf1ff", "5a049489-6823-9bcb-11ee-891a4aac5635", "4a97380a-12ca-9443-11ee-dc6e7460035a", "11efd404-a70e-93d6-2a76-1031ef1cbb50", "11efd405-967f-4b84-fedd-a3c5ace887e0", "11f03595-801b-3711-44a6-534a9c2ab850"]

const openApiUrl = "https://publicapi.drinkit.dodois.io/ru/api/v1/OperationalStatisticsByUnit/"
const openUIDs = ["1150", "139613", "139617", "139677", "139678", "139713"]

const formValues = document.forms.form
const form = document.querySelector('.form')
const earnMoneyInput = document.getElementById('earnMoney')
const percentEarnMoneyLastInput = document.getElementById('percentEarnMoneyLast')
const countOrdersInput = document.getElementById('countOrders')
const averageBillInput = document.getElementById('averageBill')
const newGuestsInput = document.getElementById('newGuests')
const oldGuestsInput = document.getElementById('oldGuests')

const motivationTextHelperEl = document.getElementById('motivationTextHelper')

const countLikesInput = document.getElementById('countLikes')
const countDislikesInput = document.getElementById('countDislikes')
const averageSpeedInput = document.getElementById('averageSpeed')
const longOrdersInput = document.getElementById('longOrders')

const sendFormButtonInput = document.getElementById('sendFormButton')

const generatedTextInput = document.getElementById('generatedText')

let percentEarnMoney = true
const percentEarnMoneyLastButton = document.getElementById('percentEarnMoneyLastButton')

const modal = new bootstrap.Modal('#resultModal')

let isValid;

// Перевод секунд во время
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
            motivationTextHelperEl.textContent = 'секунду..'
            fetch(`${apiUrl}${motivationsUUID[parseInt(formValues.coffeePlace.value)]}`).then(function (response) {
                response.json().then(function (data) {
                    console.log(data)

                    const lastUpdateTime = moment().locale('ru').calendar()
                    motivationTextHelperEl.textContent = `обновлено ${lastUpdateTime}`

                    countLikesInput.value = data.orderRatingCounter.likeCount
                    countDislikesInput.value = data.orderRatingCounter.dislikeCount
                    averageSpeedInput.value = toHHMMSS(data.todayCounter.readySecondsAvg)
                    if (!data.todayCounter.ratedOrderCounts.slow) {
                        data.todayCounter.ratedOrderCounts.slow = 0;
                    }
                    longOrdersInput.value = data.todayCounter.ratedOrderCounts.slow
                    formHandler()
                });
            });
            fetch(`${openApiUrl}${openUIDs[parseInt(formValues.coffeePlace.value)]}`).then(function (response) {
                response.json().then(function (data) {
                    console.log(data)

                    earnMoneyInput.value = data.Revenue
                    countOrdersInput.value = data.OrderCount
                    averageBillInput.value = (data.Revenue / data.OrderCount).toFixed(2)
                })
            })
        })
    });
}

function formHandler() {
    isValid = (countLikesInput.value && countDislikesInput.value && averageSpeedInput.value && longOrdersInput.value && earnMoneyInput.value && countOrdersInput.value && averageBillInput.value && newGuestsInput.value && oldGuestsInput.value && percentEarnMoneyLastInput.value);
    sendFormButtonInput.disabled = !isValid
}

function generateText() {
    let generatedText = "Отчёт "
    const coffeePlace = parseInt(document.querySelector('input[name="coffeePlace"]:checked').value);

    switch (coffeePlace) {
        case 0:
            generatedText += "W-Plaza "
            break
        case 1:
            generatedText += "Лефорт "
            break
        case 2:
            generatedText += "Барклай "
            break
        case 3:
            generatedText += "Династия Plaza "
            break
        case 4:
            generatedText += "ТЦ Планета "
        case 5:
            generatedText += "Ривьера "
    }

    generatedText += moment().format('DD.MM.YY:');

    let generatedPercent = "";
    if (percentEarnMoney) {
        generatedPercent = ` (+${percentEarnMoneyLastInput.value}%)`;
    } else {
        generatedPercent = ` (-${percentEarnMoneyLastInput.value}%)`;
    }

    if (percentEarnMoneyLastInput.value === '0') {
        generatedPercent = ` (0%)`;
    }

    generatedText += `\nВыручка - ${earnMoneyInput.value}${generatedPercent}\nЗаказы - ${countOrdersInput.value}\nСредний чек - ${averageBillInput.value}\nСредняя скорость - ${averageSpeedInput.value}\nДолгих - ${longOrdersInput.value}\nЛайки - ${countLikesInput.value}\nДизлайки - ${countDislikesInput.value}\nНовых гостей - ${newGuestsInput.value}\nСтарых гостей - ${oldGuestsInput.value}`

    generatedTextInput.textContent = generatedText
}

selectPlace()

/** Events */
// Динамическая валидация
formValues.onkeyup = () => {
    formHandler()
}
document.getElementById('sendFormButton').addEventListener('click', (e) => {
    e.preventDefault()
    if (isValid) {
        generateText()
        modal.show()
        navigator.clipboard.writeText(generatedTextInput.value)
            .then(() => {
                console.log('OK!')
            })
            .catch(() => {
                console.log('ERROR!')
            })
    }
})

const modalEl = document.querySelector('.modal')
modalEl.addEventListener('shown.bs.modal', event => {
    console.log('test')
    generatedTextInput.select()
})


function changePercentEarnMoney() {
    percentEarnMoney = !percentEarnMoney
    if (percentEarnMoney) {
        percentEarnMoneyLastButton.innerHTML = '+'
        percentEarnMoneyLastButton.classList.add('btn-success')
        percentEarnMoneyLastButton.classList.remove('btn-danger')
    } else {
        percentEarnMoneyLastButton.innerHTML = '–'
        percentEarnMoneyLastButton.classList.toggle('btn-success')
        percentEarnMoneyLastButton.classList.toggle('btn-danger')
    }
}
