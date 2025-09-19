type TitleProps = {
  title1: string
  title2?: string
  titleStyles?: string
  title1Styles?: string
  paraStyles?: string
}
const Title = ({ title1, title2, titleStyles, title1Styles, paraStyles }: TitleProps) => {
  return (
    <div className={`${titleStyles} pb-1`}>
      <h2 className={`${title1Styles} text-[25px] leading-tight md:text-[35px] md:leading-[1.3] mb-4 font-bold`}>{title1}
        <span className="text-blue-300 !font-light"> {title2}</span>
      </h2>
      <p className={`${paraStyles} hidden`}>From timeless classics to modern masterpieces, find the <br/>
        perfect read for every moment</p>
    </div>
  )
}

export default Title
