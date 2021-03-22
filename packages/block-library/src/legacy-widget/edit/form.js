/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import {
	useEffect,
	useRef,
	useState,
	useCallback,
	forwardRef,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function Form( { id, idBase, instance, setInstance } ) {
	const ref = useRef();

	const { html, setFormData } = useForm( {
		id,
		idBase,
		instance,
		setInstance,
	} );

	const onSubmit = useCallback(
		( event ) => {
			event.preventDefault();
			if ( id ) {
				setFormData( serializeForm( ref.current ) );
			}
		},
		[ id ]
	);

	const onChange = useCallback(
		debounce( () => {
			if ( idBase ) {
				setFormData( serializeForm( ref.current ) );
			}
		}, 300 ),
		[ idBase ]
	);

	return (
		<div className="wp-block-legacy-widget__edit-form-fields widget open">
			<div className="widget-inside">
				<ObservableForm
					ref={ ref }
					className="form"
					method="post"
					onSubmit={ onSubmit }
					onChange={ onChange }
				>
					<div
						className="widget-content"
						dangerouslySetInnerHTML={ { __html: html } }
					/>
					{ /* <input */ }
					{ /* 	type="hidden" */ }
					{ /* 	name="widget-id" */ }
					{ /* 	className="widget-id" */ }
					{ /* 	value={ id ?? `${ idBase }-1` } */ }
					{ /* /> */ }
					{ /* <input */ }
					{ /* 	type="hidden" */ }
					{ /* 	name="id_base" */ }
					{ /* 	className="id_base" */ }
					{ /* 	value={ id ?? idBase } */ }
					{ /* /> */ }
					{ /* <input */ }
					{ /* 	type="hidden" */ }
					{ /* 	name="widget_number" */ }
					{ /* 	className="widget_number" */ }
					{ /* 	value="1" */ }
					{ /* /> */ }
					{ /* <input */ }
					{ /* 	type="hidden" */ }
					{ /* 	name="multi_number" */ }
					{ /* 	className="multi_number" */ }
					{ /* 	value="" */ }
					{ /* /> */ }
					{ /* <input */ }
					{ /* 	type="hidden" */ }
					{ /* 	name="add_new" */ }
					{ /* 	className="add_new" */ }
					{ /* 	value="" */ }
					{ /* /> */ }
					{ id && (
						<input
							type="submit"
							name="savewidget"
							className="button button-primary widget-control-save"
							value={ __( 'Save' ) }
						/>
					) }
				</ObservableForm>
			</div>
		</div>
	);
}

function useForm( { id, idBase, instance, setInstance } ) {
	const isStillMounted = useRef();
	const [ html, setHTML ] = useState( null );
	const [ formData, setFormData ] = useState( null );

	useEffect( () => {
		isStillMounted.current = true;
		return () => ( isStillMounted.current = false );
	}, [] );

	const { createNotice } = useDispatch( noticesStore );

	useEffect( () => {
		const performFetch = async () => {
			if ( id ) {
				// Updating a widget that does not extend WP_Widget.
				try {
					let widget;
					if ( formData ) {
						widget = await apiFetch( {
							path: `/wp/v2/widgets/${ id }`,
							method: 'PUT',
							data: {
								form_data: formData,
							},
						} );
					} else {
						widget = await apiFetch( {
							path: `/wp/v2/widgets/${ id }`,
							method: 'GET',
						} );
					}
					if ( isStillMounted.current ) {
						setHTML( widget.rendered_form );
					}
				} catch ( error ) {
					createNotice(
						'error',
						error?.message ??
							__( 'An error occured while updating the widget.' )
					);
				}
			} else if ( idBase ) {
				// Updating a widget that extends WP_Widget.
				try {
					const response = await apiFetch( {
						path: `/wp/v2/widget-types/${ idBase }/encode`,
						method: 'POST',
						data: {
							instance,
							form_data: formData,
						},
					} );
					if ( isStillMounted.current ) {
						setInstance( response.instance );
						// Only set HTML the first time so that we don't cause a
						// focus loss by remounting the form.
						setHTML(
							( previousHTML ) => previousHTML ?? response.form
						);
					}
				} catch ( error ) {
					createNotice(
						'error',
						error?.message ??
							__( 'An error occured while updating the widget.' )
					);
				}
			}
		};
		performFetch();
	}, [
		id,
		idBase,
		setInstance,
		formData,
		// Do not trigger when `instance` changes so that we don't make two API
		// requests when there is form input.
	] );

	return { html, setFormData };
}

function serializeForm( form ) {
	return new window.URLSearchParams(
		Array.from( new window.FormData( form ) )
	).toString();
}

const ObservableForm = forwardRef( ( { onChange, ...props }, ref ) => {
	useEffect( () => {
		const handler = () => onChange( ref.current );
		ref.current.addEventListener( 'change', handler );
		ref.current.addEventListener( 'input', handler );
		return () => {
			ref.current.removeEventListener( 'change', handler );
			ref.current.removeEventListener( 'input', handler );
		};
	}, [ ref, onChange ] );

	return <form ref={ ref } { ...props } />;
} );
