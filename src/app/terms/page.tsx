import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Terms of Use" : "Условия использования",
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  return locale === "en" ? <TermsEn /> : <TermsRu />;
}

function TermsEn() {
  return (
    <div className="legal-page">
      <div className="legal-page-header">
        <Link href="/" className="legal-page-back">
          ← Wshka
        </Link>
        <h1 className="legal-page-title">Terms of Use</h1>
        <p className="legal-page-updated">Effective date: April 14, 2026</p>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Acceptance of terms</h2>
          <p>
            These Terms of Use ("Terms") govern your use of the Wshka web application ("Service"),
            available at wshka.ru, and constitute a public offer in accordance with Arts. 435–438 of
            the Civil Code of the Russian Federation.
          </p>
          <p>
            By registering for the Service, you accept these Terms in full. If you disagree with any
            provision, please refrain from registering or using the Service.
          </p>
          <p>The Service is intended for users aged 14 and older.</p>
          <p>
            These Terms may be updated. The current version is always available at{" "}
            <Link href="/terms" style={{ color: "var(--color-accent)" }}>
              wshka.ru/terms
            </Link>
            .
          </p>
        </div>

        <div className="legal-section">
          <h2>2. About the Service</h2>
          <p>
            Wshka is a web application for creating and sharing wishlists. The Service allows you
            to:
          </p>
          <p>— create an account and manage your personal wishlist;</p>
          <p>— share your wishlist via a unique link;</p>
          <p>— reserve items from other users' wishlists (account required).</p>
          <p>The Service is intended for personal, non-commercial use.</p>
        </div>

        <div className="legal-section">
          <h2>3. Registration and account</h2>
          <p>
            Most features of the Service require registration. When registering, you agree to
            provide a valid email address and create a secure password.
          </p>
          <p>
            You are responsible for the security of your account credentials and for all actions
            taken under your account. If you discover unauthorized access, notify us immediately at:
            security@wshka.ru.
          </p>
          <p>
            Processing of personal data during registration and use of the Service is governed by
            our{" "}
            <Link href="/privacy" style={{ color: "var(--color-accent)" }}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Acceptable use</h2>
          <p>When using the Service, you must not:</p>
          <p>— post illegal, offensive, spam, or malicious content;</p>
          <p>— use the Service for commercial purposes without explicit written approval;</p>
          <p>— interfere with the Service or attempt unauthorized access;</p>
          <p>— register accounts using another person's personal data.</p>
          <p>Violations may result in account suspension or termination.</p>
        </div>

        <div className="legal-section">
          <h2>5. User content</h2>
          <p>
            You retain all rights to content you add to the Service (item titles, URLs, notes). By
            adding content, you confirm that you have the right to use it and that it does not
            infringe third-party rights.
          </p>
          <p>
            We make no claim of ownership over user content and do not use it for commercial
            purposes.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Share links</h2>
          <p>
            When you create a share link, your wishlist becomes accessible to anyone who has that
            link. You can revoke the share link at any time from your wishlist settings. You are
            responsible for how and with whom you share the link.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Limitation of liability</h2>
          <p>
            The Service is provided "as is", without warranties of uninterrupted operation, absence
            of errors, or fitness for a particular purpose.
          </p>
          <p>
            We are not liable for direct or indirect damages arising from the use or inability to
            use the Service, except where required by applicable law of the Russian Federation.
            Limitations of liability do not apply in cases of willful misconduct or gross negligence
            on our part.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Termination of access</h2>
          <p>
            We may suspend or terminate access to the Service — in full or for individual accounts —
            in case of violations of these Terms or for other reasonable cause, with notice to the
            user where possible.
          </p>
          <p>
            You may request deletion of your account by sending a request to: security@wshka.ru.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Governing law and jurisdiction</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Russian
            Federation. Any disputes arising from the use of the Service shall be resolved in the
            courts of the Russian Federation at the location of the operator.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The current version is published at
            wshka.ru/terms with the effective date. Continued use of the Service after changes are
            published constitutes acceptance of the updated Terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Contact</h2>
          <p>For questions related to these Terms: security@wshka.ru.</p>
        </div>
      </div>
    </div>
  );
}

function TermsRu() {
  return (
    <div className="legal-page">
      <div className="legal-page-header">
        <Link href="/" className="legal-page-back">
          ← Wshka
        </Link>
        <h1 className="legal-page-title">Условия использования</h1>
        <p className="legal-page-updated">Дата вступления в силу: 14 апреля 2026 г.</p>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>1. Принятие условий</h2>
          <p>
            Настоящие Условия использования («Условия») регулируют порядок использования
            веб-приложения Wshka («Сервис»), доступного на wshka.ru, и являются публичной
            офертой в соответствии со ст. 435–438 Гражданского кодекса Российской Федерации.
          </p>
          <p>
            Регистрируясь в Сервисе, вы акцептуете настоящие Условия в полном объёме.
            Если вы не согласны с каким-либо из пунктов Условий, пожалуйста, воздержитесь
            от регистрации и использования Сервиса.
          </p>
          <p>Сервис предназначен для лиц, достигших возраста 14 лет.</p>
          <p>
            Условия могут быть обновлены. Актуальная версия всегда доступна по адресу{" "}
            <Link href="/terms" style={{ color: "var(--color-accent)" }}>
              wshka.ru/terms
            </Link>
            .
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Описание Сервиса</h2>
          <p>
            Wshka — веб-приложение для создания и публичного доступа к вишлистам (спискам желаний).
            Сервис позволяет:
          </p>
          <p>— создавать аккаунт и вести личный вишлист желаний;</p>
          <p>— публиковать вишлист по уникальной публичной ссылке;</p>
          <p>— бронировать желания из чужих вишлистов (при наличии аккаунта).</p>
          <p>Сервис предназначен для личного некоммерческого использования.</p>
        </div>

        <div className="legal-section">
          <h2>3. Регистрация и аккаунт</h2>
          <p>
            Для использования большинства функций Сервиса необходима регистрация.
            При регистрации вы обязуетесь предоставить достоверный адрес электронной почты
            и создать надёжный пароль.
          </p>
          <p>
            Вы несёте ответственность за сохранность данных своего аккаунта и за все действия,
            совершённые с его использованием. При обнаружении несанкционированного доступа
            немедленно уведомьте нас по адресу: security@wshka.ru.
          </p>
          <p>
            Обработка персональных данных при регистрации и использовании Сервиса регулируется
            отдельным документом —{" "}
            <Link href="/privacy" style={{ color: "var(--color-accent)" }}>
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Правила использования</h2>
          <p>При использовании Сервиса запрещается:</p>
          <p>— размещать незаконный, оскорбительный, спамовый или вредоносный контент;</p>
          <p>— использовать Сервис в коммерческих целях без явного письменного согласования;</p>
          <p>— нарушать работу Сервиса или осуществлять попытки несанкционированного доступа;</p>
          <p>— регистрировать аккаунты с использованием чужих персональных данных.</p>
          <p>Нарушение правил может повлечь блокировку аккаунта.</p>
        </div>

        <div className="legal-section">
          <h2>5. Контент пользователя</h2>
          <p>
            Вы сохраняете все права на контент, добавляемый в Сервис (названия желаний,
            ссылки, заметки). Добавляя контент, вы подтверждаете, что обладаете правом
            на его использование и он не нарушает прав третьих лиц.
          </p>
          <p>
            Оператор не претендует на права собственности на пользовательский контент и не
            использует его в коммерческих целях.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Публичные ссылки</h2>
          <p>
            При создании публичной ссылки вишлист становится доступным для просмотра любому,
            у кого есть эта ссылка. Вы можете отозвать публичную ссылку в любой момент
            в настройках вашего вишлиста. Ответственность за распространение публичной ссылки
            несёт пользователь.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Ограничение ответственности</h2>
          <p>
            Сервис предоставляется «как есть» (as is) без гарантий бесперебойной работы,
            отсутствия ошибок или пригодности для конкретных целей.
          </p>
          <p>
            Оператор не несёт ответственности за прямые или косвенные убытки, возникшие
            в связи с использованием или невозможностью использования Сервиса, за исключением
            случаев, предусмотренных действующим законодательством Российской Федерации.
            Положения об ограничении ответственности не применяются в случаях умысла или
            грубой неосторожности оператора.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Прекращение доступа</h2>
          <p>
            Оператор вправе приостановить или прекратить доступ к Сервису (полностью или
            для отдельных аккаунтов) в случае нарушения настоящих Условий или по иным
            обоснованным причинам с уведомлением пользователя, когда это возможно.
          </p>
          <p>
            Вы можете запросить удаление своего аккаунта, направив запрос на адрес:
            security@wshka.ru.
          </p>
        </div>

        <div className="legal-section">
          <h2>9. Применимое право и юрисдикция</h2>
          <p>
            Настоящие Условия регулируются и толкуются в соответствии с законодательством
            Российской Федерации. Все споры, возникающие в связи с использованием Сервиса,
            подлежат рассмотрению в судах Российской Федерации по месту нахождения оператора.
          </p>
        </div>

        <div className="legal-section">
          <h2>10. Изменение условий</h2>
          <p>
            Оператор вправе обновлять настоящие Условия. Актуальная редакция публикуется
            по адресу wshka.ru/terms с указанием даты вступления в силу. Продолжение
            использования Сервиса после публикации изменений означает акцепт обновлённых Условий.
          </p>
        </div>

        <div className="legal-section">
          <h2>11. Контакт</h2>
          <p>По вопросам, связанным с настоящими Условиями: security@wshka.ru.</p>
        </div>
      </div>
    </div>
  );
}
