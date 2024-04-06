const apiUrl = "https://drinkit-mobile-api.drinkit.dodois.io/motivation/v2/GetMotivationBoard?countryId=643&unitId="
const motivationsUUID = ["fe009d98-f69b-87a0-11ed-6a59445cf1ff", "5a049489-6823-9bcb-11ee-891a4aac5635", "4a97380a-12ca-9443-11ee-dc6e7460035a"]

const formValues = document.forms.form
const form = document.querySelector('.form')
const earnMoneyInput = document.getElementById('earnMoney')
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
        })
    });
}

function formHandler() {
    isValid = (countLikesInput.value && countDislikesInput.value && averageSpeedInput.value && longOrdersInput.value && earnMoneyInput.value && countOrdersInput.value && averageBillInput.value && newGuestsInput.value && oldGuestsInput.value);
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
    }

    generatedText += moment().format('DD.MM.YY:');

    generatedText += `\nВыручка - ${earnMoneyInput.value}\nЗаказы - ${countOrdersInput.value}\nСредний чек - ${averageBillInput.value}\nСредняя скорость - ${averageSpeedInput.value}\nДолгих - ${longOrdersInput.value}\nЛайки - ${countLikesInput.value}\nДизлайки - ${countDislikesInput.value}\nНовых гостей - ${newGuestsInput.value}\nСтарых гостей - ${oldGuestsInput.value}`

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
