import styles from './Input.module.css'

export default function Input({ label, error, icon, ...props }) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input className={[styles.input, error ? styles.hasError : '', icon ? styles.withIcon : ''].join(' ')} {...props} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
