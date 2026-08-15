function Works() {
  return (
    <section className="works" id="works">
      <div className="works-inner container">
        <h2 className="works-title">
          От первой даты до монтажа в день свадьбы —{' '}
          <span className="works-title-accent">как работаем</span>.
        </h2>

        <ol className="works-list">
          <li className="works-item">
            <h3 className="works-item-title">
              <span className="works-num">01</span> Смотрим дату
            </h3>
            <p className="works-item-text">
              Проверяем загрузку и понимаем, успеваем ли сделать ваш день сильным.
            </p>
          </li>

          <li className="works-item works-item--right">
            <h3 className="works-item-title">
              <span className="works-num">02</span> Собираем стиль
            </h3>
            <p className="works-item-text">
              Букет, церемония, банкет — в одной эстетике, без случайных решений.
            </p>
          </li>

          <li className="works-item">
            <h3 className="works-item-title">
              <span className="works-num">03</span> Смета и фиксация
            </h3>
            <p className="works-item-text">
              Согласуем состав и бюджет. После предоплаты дата закрепляется за вами.
            </p>
          </li>

          <li className="works-item works-item--right">
            <h3 className="works-item-title">
              <span className="works-num">04</span> День свадьбы
            </h3>
            <p className="works-item-text">
              Привозим, ставим, проверяем свежесть и форму — чтобы всё держалось в кадре.
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}

export default Works
