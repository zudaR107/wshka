import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Privacy Policy" : "Политика конфиденциальности",
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  return locale === "en" ? <PrivacyEn /> : <PrivacyRu />;
}

function PrivacyEn() {
  return (
    <div className="legal-page">
      <div className="legal-page-header">
        <Link href="/" className="legal-page-back">
          ← Wshka
        </Link>
        <h1 className="legal-page-title">Privacy Policy</h1>
        <p className="legal-page-updated">Effective date: April 14, 2026</p>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. General</h2>
          <p>
            This Privacy Policy ("Policy") describes how Wshka ("Service", "we"), available at
            wshka.ru, collects, stores, uses, and protects personal data of its users ("you",
            "user").
          </p>
          <p>
            Personal data is processed in accordance with Federal Law No. 152-FZ of July 27, 2006
            "On Personal Data" (Russian Federation).
          </p>
          <p>
            The Service is intended for users aged 14 and older. Use by persons under 14 is
            permitted only with parental or guardian consent.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Data controller</h2>
          <p>The data controller is an individual: Daniil Zudin.</p>
          <p>Contact address: security@wshka.ru.</p>
        </div>

        <div className="legal-section">
          <h2>3. Data we collect and how we use it</h2>
          <p>The following personal data is processed when you register and use the Service:</p>
          <p>
            <strong>Email address</strong> — your account identifier, used for authentication.
            Operations: collection, storage, use for login.
          </p>
          <p>
            <strong>Password</strong> — stored exclusively as a cryptographic hash (bcrypt). The
            original password is never stored or transmitted in plain text. Operations: collection
            (immediately hashed), storage of hash, use for login verification.
          </p>
          <p>
            <strong>Session token</strong> — an anonymous random identifier transmitted via an
            HTTP-only cookie. Operations: generation, storage, use for authorization, deletion on
            logout or expiry.
          </p>
          <p>
            <strong>Wishlist content</strong> — item titles, URLs, notes, and prices. Operations:
            collection, storage, display to the owner, and display to third parties only when an
            active share link created by the owner exists.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Legal basis for processing</h2>
          <p>
            Personal data is processed on the basis of the user's consent (Art. 6, Part 1, Clause 1
            of Federal Law No. 152-FZ).
          </p>
          <p>
            Consent is given at registration by completing and submitting the registration form. The
            consent is free, specific, informed, and deliberate (Art. 9, 152-FZ).
          </p>
          <p>
            You may withdraw your consent at any time by sending a request to: security@wshka.ru.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Purposes of processing</h2>
          <p>Personal data is processed solely for the following purposes:</p>
          <p>— user authentication and authorization;</p>
          <p>— storing and displaying the owner's wishlist and items;</p>
          <p>— enabling share links and gift reservations.</p>
          <p>
            Data is not used for marketing or advertising, is not shared with third parties for
            commercial purposes, and is not sold.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Retention period</h2>
          <p>
            Personal data is retained until the account is deleted at the user's request or until
            the Service ceases operation. Upon receiving a deletion request, data is destroyed
            within 30 days.
          </p>
          <p>
            Session tokens are retained until the user logs out or the session expires automatically.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Storage and security</h2>
          <p>
            All personal data is processed and stored on servers located in the Russian Federation,
            in accordance with the requirements of Art. 18.1 and 18.5 of Federal Law No. 152-FZ.
            No cross-border transfer of personal data takes place.
          </p>
          <p>
            Data between your browser and the server is transmitted over an encrypted channel
            (HTTPS/TLS). Passwords are stored only as irreversible cryptographic hashes and cannot
            be recovered.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Sharing with third parties</h2>
          <p>
            Personal data is not shared with third parties, except as required by applicable law of
            the Russian Federation.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Incident notification</h2>
          <p>
            In the event of a security breach resulting in unauthorized disclosure of personal data,
            we will notify Roskomnadzor within the timeframes required by law. Users whose data may
            have been affected will be notified by email at the address provided during registration.
          </p>
        </div>

        <div className="legal-section" id="cookie">
          <h2>10. Cookies</h2>
          <p>
            The Service uses one HTTP-only cookie ("wshka_session") to store an anonymous session
            token. This cookie is technically necessary for authentication; without it, login is not
            possible.
          </p>
          <p>Analytical, advertising, and tracking cookies are not used.</p>
          <p>The cookie is automatically deleted on logout or when the session expires.</p>
        </div>

        <div className="legal-section">
          <h2>11. Your rights</h2>
          <p>Under Art. 14–17 of Federal Law No. 152-FZ, you have the right to:</p>
          <p>— obtain information about whether your personal data is being processed and what it includes;</p>
          <p>— request correction of inaccurate or outdated data;</p>
          <p>— request deletion of your account and all associated personal data;</p>
          <p>— withdraw consent to data processing;</p>
          <p>— file a complaint with Roskomnadzor (rkn.gov.ru).</p>
          <p>
            To exercise any of these rights, send a request to: security@wshka.ru. Requests are
            processed within 30 days of receipt.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Changes to this Policy</h2>
          <p>
            We may update this Policy from time to time. The current version is always published at{" "}
            <Link href="/privacy" style={{ color: "var(--color-accent)" }}>
              wshka.ru/privacy
            </Link>{" "}
            with the effective date. Users will be notified by email of material changes.
          </p>
        </div>

        <div className="legal-section">
          <h2>13. Contact</h2>
          <p>For any questions regarding the processing of your personal data: security@wshka.ru.</p>
        </div>
      </div>
    </div>
  );
}

function PrivacyRu() {
  return (
    <div className="legal-page">
      <div className="legal-page-header">
        <Link href="/" className="legal-page-back">
          ← Wshka
        </Link>
        <h1 className="legal-page-title">Политика конфиденциальности</h1>
        <p className="legal-page-updated">Дата вступления в силу: 14 апреля 2026 г.</p>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности («Политика») описывает порядок сбора, хранения,
            использования и защиты персональных данных пользователей («вы», «пользователь»)
            веб-приложения Wshka («Сервис»), доступного на wshka.ru.
          </p>
          <p>
            Обработка персональных данных осуществляется в соответствии с Федеральным законом
            от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
          <p>
            Сервис предназначен для лиц, достигших возраста 14 лет. Использование Сервиса лицами
            моложе 14 лет допускается только с согласия родителей или законных представителей.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Оператор персональных данных</h2>
          <p>
            Оператором персональных данных является физическое лицо: Зудин Даниил Васильевич.
          </p>
          <p>Контактный адрес: security@wshka.ru.</p>
        </div>

        <div className="legal-section">
          <h2>3. Категории обрабатываемых данных и действия с ними</h2>
          <p>
            При регистрации и использовании Сервиса обрабатываются следующие персональные данные:
          </p>
          <p>
            <strong>Адрес электронной почты</strong> — идентификатор аккаунта, используется
            для входа в систему. Действия: сбор, хранение, использование для аутентификации.
          </p>
          <p>
            <strong>Пароль</strong> — хранится исключительно в виде криптографического хэша (bcrypt).
            Исходный пароль не сохраняется и не передаётся в открытом виде. Действия: сбор
            (немедленное хэширование), хранение хэша, использование для проверки при входе.
          </p>
          <p>
            <strong>Токен сессии</strong> — анонимный случайный идентификатор, передаётся через
            HTTP-only cookie. Действия: генерация, хранение, использование для авторизации,
            удаление при выходе из аккаунта или истечении срока.
          </p>
          <p>
            <strong>Содержимое вишлиста</strong> — названия, ссылки, заметки и цены желаний.
            Действия: сбор, хранение, отображение владельцу, а также третьим лицам —
            только при наличии активной публичной ссылки, созданной самим пользователем.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Правовое основание обработки</h2>
          <p>
            Обработка персональных данных осуществляется на основании согласия субъекта персональных
            данных (ст. 6, ч. 1, п. 1 Федерального закона № 152-ФЗ).
          </p>
          <p>
            Согласие на обработку персональных данных предоставляется пользователем в момент
            регистрации в Сервисе путём заполнения и отправки регистрационной формы. Согласие
            является свободным, конкретным, информированным и сознательным (ст. 9 152-ФЗ).
          </p>
          <p>
            Оператор хранит подтверждение факта получения согласия. Вы вправе отозвать согласие
            в любое время, направив запрос на адрес: security@wshka.ru.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Цели обработки данных</h2>
          <p>Персональные данные обрабатываются исключительно в следующих целях:</p>
          <p>— аутентификация и авторизация пользователей;</p>
          <p>— хранение и отображение вишлиста и желаний владельца;</p>
          <p>— обеспечение функционирования публичных ссылок и бронирований.</p>
          <p>
            Данные не используются в маркетинговых или рекламных целях, не передаются третьим
            лицам в коммерческих целях и не продаются.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Срок хранения данных</h2>
          <p>
            Персональные данные хранятся до момента удаления аккаунта по запросу пользователя
            или до прекращения работы Сервиса. После получения запроса на удаление данные
            уничтожаются в течение 30 дней.
          </p>
          <p>
            Токены сессий хранятся до выхода пользователя из аккаунта или до автоматического
            истечения срока действия.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Хранение и защита данных</h2>
          <p>
            Все персональные данные обрабатываются и хранятся на серверах, расположенных
            на территории Российской Федерации, в соответствии с требованиями ст. 18.1 и 18.5
            Федерального закона № 152-ФЗ. Трансграничная передача персональных данных
            не осуществляется.
          </p>
          <p>
            Передача данных между пользователем и сервером осуществляется по зашифрованному
            каналу (HTTPS/TLS). Пароли хранятся только в виде необратимого криптографического
            хэша и не могут быть восстановлены.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Передача данных третьим лицам</h2>
          <p>
            Персональные данные пользователей не передаются третьим лицам, за исключением
            случаев, прямо предусмотренных действующим законодательством Российской Федерации.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Уведомление об инцидентах</h2>
          <p>
            В случае обнаружения нарушения безопасности, повлёкшего неправомерное распространение
            персональных данных, оператор уведомляет Роскомнадзор в сроки, установленные
            законодательством. Пользователям, чьи данные могли быть затронуты, направляется
            уведомление на электронную почту, указанную при регистрации.
          </p>
        </div>

        <div className="legal-section" id="cookie">
          <h2>10. Cookie</h2>
          <p>
            Сервис использует один HTTP-only cookie («wshka_session») для хранения анонимного
            токена сессии. Данный cookie является технически необходимым для работы
            аутентификации; без него вход в аккаунт невозможен.
          </p>
          <p>Аналитические, рекламные и трекинговые cookie не используются.</p>
          <p>Cookie автоматически удаляется при выходе из аккаунта или истечении срока сессии.</p>
        </div>

        <div className="legal-section">
          <h2>11. Права субъекта персональных данных</h2>
          <p>В соответствии со ст. 14–17 Федерального закона № 152-ФЗ вы вправе:</p>
          <p>— получить информацию о факте обработки и составе ваших персональных данных;</p>
          <p>— потребовать исправления неточных или устаревших данных;</p>
          <p>— потребовать удаления аккаунта и всех связанных персональных данных;</p>
          <p>— отозвать согласие на обработку персональных данных;</p>
          <p>— обратиться с жалобой в Роскомнадзор (rkn.gov.ru).</p>
          <p>
            Для реализации любого из указанных прав направьте запрос на адрес: security@wshka.ru.
            Запрос рассматривается в течение 30 дней с момента получения.
          </p>
        </div>

        <div className="legal-section">
          <h2>12. Изменения Политики</h2>
          <p>
            Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция
            публикуется по адресу{" "}
            <Link href="/privacy" style={{ color: "var(--color-accent)" }}>
              wshka.ru/privacy
            </Link>{" "}
            с указанием даты вступления в силу. При существенных изменениях пользователи
            уведомляются по электронной почте.
          </p>
        </div>

        <div className="legal-section">
          <h2>13. Контакт</h2>
          <p>
            По любым вопросам, связанным с обработкой персональных данных: security@wshka.ru.
          </p>
        </div>
      </div>
    </div>
  );
}
