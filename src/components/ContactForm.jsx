import { useState, createContext, use } from 'react';
import { useInView } from '../hooks/useInView';
import { fadeUp } from '../utils/classNames';
import UserIcon from './icons/UserIcon';
import MailIcon from './icons/MailIcon';
import SubjectIcon from './icons/SubjectIcon';
import MessageIcon from './icons/MessageIcon';
import './ContactForm.css';

const EMAIL_REGEX = /\S+@\S+\.\S+/;

// Define clean, structured Context for Compound Components
const ContactFormContext = createContext(null);

export function ContactFormProvider({ children }) {
  const [ref, visible] = useInView();
  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    asunto: 'general',
    mensaje: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formState.nombre.trim()) {
      newErrors.nombre = 'Por favor, introduce tu nombre.';
    }
    if (!formState.email.trim()) {
      newErrors.email = 'Por favor, introduce tu correo electrónico.';
    } else if (!EMAIL_REGEX.test(formState.email)) {
      newErrors.email = 'Por favor, introduce un correo electrónico válido.';
    }
    if (!formState.mensaje.trim()) {
      newErrors.mensaje = 'Por favor, escribe tu mensaje.';
    } else if (formState.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error on keypress
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate sending email with a premium experience
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        nombre: '',
        email: '',
        asunto: 'general',
        mensaje: '',
      });
    }, 1500);
  };

  const resetForm = () => {
    setIsSubmitted(false);
  };

  return (
    <ContactFormContext value={{
      state: { formState, errors, isSubmitting, isSubmitted, visible },
      actions: { handleChange, handleSubmit, resetForm },
      meta: { ref }
    }}>
      {children}
    </ContactFormContext>
  );
}

export function ContactFormSection({ children }) {
  const { meta } = use(ContactFormContext);
  return (
    <section className="contacto" id="contacto" ref={meta.ref}>
      <div className="contacto-container">
        {children}
      </div>
    </section>
  );
}

export function ContactFormHeader({ title, description }) {
  const { state } = use(ContactFormContext);
  return (
    <div className={fadeUp('contacto-header', state.visible)}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function ContactFormCard({ children }) {
  const { state } = use(ContactFormContext);
  return (
    <div className={fadeUp('contacto-form-card', state.visible)}>
      {children}
    </div>
  );
}

export function ContactFormFrame({ children }) {
  const { state, actions } = use(ContactFormContext);
  if (state.isSubmitted) return null;
  return (
    <form onSubmit={actions.handleSubmit} noValidate>
      {children}
    </form>
  );
}

export function ContactFormGroup({ label, name, icon: Icon, children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={name}>
        {Icon && <Icon />}
        {label}
      </label>
      <div className="form-control-wrap">
        {children}
      </div>
    </div>
  );
}

export function ContactFormInput({ name, type = 'text', placeholder, ...props }) {
  const { state, actions } = use(ContactFormContext);
  const error = state.errors[name];

  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={state.formState[name]}
        onChange={actions.handleChange}
        disabled={state.isSubmitting}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${name}-error`} className="form-error">
          {error}
        </span>
      )}
    </>
  );
}

export function ContactFormSelect({ name, children }) {
  const { state, actions } = use(ContactFormContext);
  return (
    <>
      <select
        id={name}
        name={name}
        className="form-control"
        value={state.formState[name]}
        onChange={actions.handleChange}
        disabled={state.isSubmitting}
      >
        {children}
      </select>
      <div className="select-arrow" />
    </>
  );
}

export function ContactFormTextarea({ name, placeholder }) {
  const { state, actions } = use(ContactFormContext);
  const error = state.errors[name];

  return (
    <>
      <textarea
        id={name}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={state.formState[name]}
        onChange={actions.handleChange}
        disabled={state.isSubmitting}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="form-error">
          {error}
        </span>
      )}
    </>
  );
}

export function ContactFormSubmit({ children }) {
  const { state } = use(ContactFormContext);
  return (
    <button
      type="submit"
      className="btn-submit"
      disabled={state.isSubmitting}
    >
      <span>{state.isSubmitting ? 'Enviando…' : children}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  );
}

export function ContactFormSuccess({ title, description, backButtonText }) {
  const { state, actions } = use(ContactFormContext);
  if (!state.isSubmitted) return null;

  return (
    <div className="contacto-success" role="status" aria-live="polite">
      <div className="success-icon-wrap">
        <div className="success-pulse" aria-hidden="true" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="soundwave-visual" aria-hidden="true">
        <span className="soundwave-bar" />
        <span className="soundwave-bar" />
        <span className="soundwave-bar" />
        <span className="soundwave-bar" />
        <span className="soundwave-bar" />
      </div>
      <button
        onClick={actions.resetForm}
        className="btn-back-form"
      >
        {backButtonText}
      </button>
    </div>
  );
}

// Pre-composed, fully backward-compatible layout as default export
export default function ContactForm() {
  return (
    <ContactFormProvider>
      <ContactFormSection>
        <ContactFormHeader
          title="Contáctanos"
          description="¿Tienes alguna sugerencia, pregunta o quieres colaborar con nosotros? Escríbenos y nos pondremos en contacto contigo."
        />
        <ContactFormCard>
          <ContactFormFrame>
            <div className="form-grid">
              <ContactFormGroup label="Nombre" name="nombre" icon={UserIcon}>
                <ContactFormInput name="nombre" placeholder="Tu nombre" autoComplete="name" />
              </ContactFormGroup>

              <ContactFormGroup label="Correo Electrónico" name="email" icon={MailIcon}>
                <ContactFormInput name="email" type="email" placeholder="nombre@ejemplo.com" autoComplete="email" spellCheck={false} />
              </ContactFormGroup>
            </div>

            <ContactFormGroup label="Motivo de contacto" name="asunto" icon={SubjectIcon} className="full-width">
              <ContactFormSelect name="asunto">
                <option value="general">Consulta general</option>
                <option value="invitado">Sugerencia de invitado</option>
                <option value="carlos">Pregunta directa para Carlos</option>
                <option value="patrocinio">Patrocinio / Colaboración</option>
                <option value="feedback">Feedback del podcast</option>
              </ContactFormSelect>
            </ContactFormGroup>

            <ContactFormGroup label="Mensaje" name="mensaje" icon={MessageIcon} className="full-width">
              <ContactFormTextarea name="mensaje" placeholder="Escribe tu mensaje aquí…" />
            </ContactFormGroup>

            <ContactFormSubmit>Enviar mensaje</ContactFormSubmit>
          </ContactFormFrame>

          <ContactFormSuccess
            title="¡Mensaje recibido!"
            description="Gracias por ponerte en contacto. Valoramos mucho tus ideas y nos comunicaremos contigo lo antes posible."
            backButtonText="Enviar otro mensaje"
          />
        </ContactFormCard>
      </ContactFormSection>
    </ContactFormProvider>
  );
}

// Attach subcomponents to default export for premium Compound API
ContactForm.Provider = ContactFormProvider;
ContactForm.Section = ContactFormSection;
ContactForm.Header = ContactFormHeader;
ContactForm.Card = ContactFormCard;
ContactForm.Frame = ContactFormFrame;
ContactForm.Group = ContactFormGroup;
ContactForm.Input = ContactFormInput;
ContactForm.Select = ContactFormSelect;
ContactForm.Textarea = ContactFormTextarea;
ContactForm.Submit = ContactFormSubmit;
ContactForm.Success = ContactFormSuccess;
