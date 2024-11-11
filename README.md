
# CyberZ1on

## [8RCKntW4LL]
### Инфо
**Категория:** Crypto
**Стоимость:** 100
**Репозиторий:** https://github.com/andreika47/CyberZ1on
**Автор:** andreika47
**Флаг:** cyzi{crypt0_h4s_y0u}
### Разбор
Открыв файл с заданием *8RCKntW4LL_task.docx* увидим следующий шифртекст:

lII||I|I|l|l|l||II|I||l|ll|lIl|lI||II||I|||l||IIlIIlllII|||II||IIl|IlIIlIlll|lll||l|ll|l||lIlIIlllIII

Присмотревшись к тексту можно заметить, что полоски разной длины: маленькая, средняя и большая. Если попробовать скопировать эти символы в другие редакторы или "поиграться со шрифтами", то можно понять, что это символы: заглавная i, строчная L и вертикальная черта |.
Больше никаких вводных данных нет, похожих известных шифров в голову не приходит - значит нужно подумать над возможными преобразованиями шифртекста. Так как используется всего 3 различных символа, значит существует некоторый алгоритм кодирования исходного теста в шифртекст. Делаем предположение: каждому символу соответствует одна из цифр троичной системы: 0, 1, 2.
Очевидно, что каждому символу соответствует уникальная цифра (иначе, декодирование шифртекста в исходный текст было бы невозможным). Тогда у нас имеется 3!=6 различных вариантов отображения символа в цифру. Переберем их все, а полученные числа в троичной системе попробуем перевести в буквы.

Пример скрипта для решения задания: Crypto/8RCKntW4LL/decipher.py

## [8R0F4]
### Инфо
**Категория:** Web
**Стоимость:** 200
**Репозиторий:** https://github.com/andreika47/CyberZ1on
**Автор:** andreika47
**Флаг:** cyzi{Zd4r0va_b4nd1ty}
### Разбор
#### Password Challenge
По ссылке из задания нам доступна форма аутентификации по логину и паролю. Пробуем ввести банальное admin:admin, test:test, admin:password - получаем сообщение "ТЫ НЕ БРАТ". Обратив внимание на это сообщение, вспомнив легенду или попытавшись аккуратно побрутить можно прийти к правильному логину паролю: brother:brother

*Пример команды для перебора логина и пароля с помощью ffuf*
ffuf -u "https://141.101.151.48:10000/login" -d "username=HFUZZ&password=WFUZZ" -w ./xato-net-10-million-passwords-10000.txt:HFUZZ -w ./xato-net-10-million-passwords-10000.txt:WFUZZ --rate 100 -fs 1700
#### Cert Challenge
Введя правильный логин и пароль, мы попадем на следующую страницу, где нас попросят показать сертификат. Попробуем разобраться как работает аутентификация: для начала выпустим какой-нибудь сертификат

openssl req -x509 -newkey rsa:4096 -keyout somekey.pem -out somecert.pem

И попробуем обратиться с этим сертификатом на эндпоинт с аутентификацией

curl "https://141.101.151.48:10000:10000/cert" --cert somecert.pem --key somekey.pem -kv

В ответе увидим редирект на форму аутентификации с логином и паролем. Значит, существует какая-то авторизация, запрещающая нам обращаться к эндпоинту /cert. Обычно - это куки, и, проверив наше предположение, увидим, что после ввода правильного логина и пароля нам выдается кука LOGIN_COOKIE=bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY (да, кука у всех одинаковая).
Снова пробуем отправить сертификат, но уже с кукой

curl "https://141.101.151.48:10000:10000/cert" --cookie "LOGIN_COOKIE=bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY" --cert somecert.pem --key somekey.pem -kv

В ответе не видим ничего интересного, кроме дизморального сообщения об ошибке. Вспоминая о легенде CTF и о логине с паролем из прошлой части пробуем выпустить новый сертификат, указав brother во всех возможных полях сертификата

openssl req -x509 -newkey rsa:4096 -keyout brother-key.pem -out brother-cert.pem

Пробуем отправить новый сертификат, не забыв про куку

curl "https://141.101.151.48:10000:10000/cert" --cookie "LOGIN_COOKIE=bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY" --cert brother-cert.pem --key brother-key.pem -kv

В ответе видим редирект на следующий этап /face и новую куку CERT_COOKIE=98SB3GnBzZbDFf7DepvEID61T8wyJoO8
#### Face Challenge
Добавив новую куку в браузер и вручную перейдя на https://141.101.151.48:10000:10000/face нам откроется форма, транслирующая видео с нашей веб-камеры, если она есть. Если веб-камера отсутствует или в браузере стоит запрет на ее использование, то страница будет пустой. В обоих случаях стоит обратить внимание на код страницы:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BroFA: Face Challenge</title>
        <link rel="icon" type="image/png" href="images/brother-icon.png">               <!-- какая-то кастомная иконка сайта -->
        <link rel="stylesheet" href="/css/style.css"> 
        <script src="/socket.io/socket.io.js"></script>                                  <!-- использование сокетов -->
    </head>
    <body>
        <h1 style="color:#7F00FF;position:fixed; top:0;left:0;">BroFA: Face Challenge</h1>
        <video id="video" style="position:absolute;justify-content: center;" autoplay></video>       <!-- элемент для трансляции видео -->
        <canvas id="c" style="position:fixed; top:0;left:0;z-index:-1;opacity:.95"></canvas>
        <script>
            const video = document.getElementById('video');                               
            const socket = io();
    
            navigator.mediaDevices.getUserMedia({ video: {} })                 // получение дексриптора веб-камеры
                .then(stream => {
                    video.srcObject = stream;                                  // отправка данных из веб-камеры в элемент для транслфции видео
                    video.play();                                 
                });
    
            // периодическая отправка экрана на бэкенд
    
            setInterval(() => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0);                               // захват экрана в эелементе видео (условно, скриншот)
                const dataUrl = canvas.toDataURL('image/jpeg');
    
                if (dataUrl.length > 6) {
                    socket.emit('image', dataUrl);                            // отправка скриншота с видео по сокету на бэкенд
                }
            }, 1000);
    
            // обработка сообщений от бэкенда
    
            socket.on('results', (detections) => {
                console.log('Detections:', detections);
            });
            socket.on('redirect', function(destination) {
                window.location.href = destination;
            });
        </script>
        <script>
            var c = document.getElementById("c");
            var ctx = c.getContext("2d");
    
            c.height = window.innerHeight;
            c.width = window.innerWidth;
    
            var matrix = "Поживёшь подольше — увидишь побольше.";
            matrix = matrix.split("");
    
            var font_size = 10;
            var columns = c.width/font_size;
            var drops = [];
    
            for(var x = 0; x < columns; x++)
                drops[x] = 1; 
    
            function draw()
            {
                ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
                ctx.fillRect(0, 0, c.width, c.height);
    
                ctx.fillStyle = "#7F00FF";
                ctx.font = font_size + "px arial";
    
                for(var i = 0; i < drops.length; i++)
                {
                    var text = matrix[Math.floor(Math.random()*matrix.length)];
                    ctx.fillText(text, i*font_size, drops[i]*font_size);
    
                    if(drops[i]*font_size > c.height && Math.random() > 0.975)
                        drops[i] = 0;
    
                    drops[i]++;
                }
            }
    
            setInterval(draw, 35);
        </script>
    </body>
    </html>

Изучив код можно предположить, что это аутентификация по лицу. Обратим внимание на иконку сайта *images/brother-icon.png*