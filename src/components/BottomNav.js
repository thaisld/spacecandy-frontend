import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

export default function BottomNav({ tabs, activeKey, onChange, cartCount, iconRenderer }) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        const count = tab.key === 'cart' ? cartCount : 0;

        return (
          <Pressable
            accessibilityRole="button"
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && styles.pressed]}
          >
            <View style={styles.iconSlot}>
              {iconRenderer(tab.icon, 23, active ? colors.black : colors.muted)}
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.label, active && styles.labelActive]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 72,
    backgroundColor: colors.midnight,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  itemActive: {
    backgroundColor: colors.sun,
  },
  iconSlot: {
    position: 'relative',
    width: 32,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.muted,
    fontFamily: 'Courier New',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  labelActive: {
    color: colors.black,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.78,
  },
});
