import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation(['common', 'user']);


  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      <h2>{t('greeting', {  name: "Tiavina" })}</h2>
      <h2>{t('greeting', {  name: "Ben" })}</h2>
      <h2>{t('user:birthday')}</h2>
    </div>
  )
}

export default Home