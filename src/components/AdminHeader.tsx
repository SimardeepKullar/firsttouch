import { Text } from 'react-native';

/** The "Admin" title at the top of 06-09. The mockups also draw an ADMIN tag here; it was dropped because the title already says it (see the disagreements table). */
export function AdminHeader() {
    return (
    <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
      Admin
    </Text>
  );

}
