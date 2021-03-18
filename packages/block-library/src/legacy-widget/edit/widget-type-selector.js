/**
 * WordPress dependencies
 */
import { Spinner, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function WidgetTypeSelector( { selectedId, onSelect } ) {
	// TODO: Filter out hidden widgets.

	const widgetTypes = useSelect(
		( select ) => select( coreStore ).getWidgetTypes( { per_page: -1 } ),
		[]
	);

	if ( ! widgetTypes ) {
		return <Spinner />;
	}

	if ( widgetTypes?.length === 0 ) {
		return __( 'There are no widgets available.' );
	}

	return (
		<SelectControl
			label={ __( 'Select a legacy widget to display:' ) }
			value={ selectedId }
			options={ [
				{ value: null, label: __( 'Select widget' ) },
				...widgetTypes.map( ( widgetType ) => ( {
					value: widgetType.id,
					label: widgetType.name,
				} ) ),
			] }
			onChange={ ( value ) => {
				if ( value ) {
					const selected = widgetTypes.find(
						( widgetType ) => widgetType.id === value
					);
					onSelect( {
						selectedId: selected.id,
						// TODO: Don't use widget_class.
						isMulti: !! selected.widget_class,
					} );
				} else {
					onSelect( { selectedId: null } );
				}
			} }
		/>
	);
}
