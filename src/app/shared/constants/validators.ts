export class Validators_Pattern {
    public static GST_NUMBER = '^([0-3][0-9])([A-Z]{5}[0-9]{4}[A-Z])([1-9A-Z])Z([0-9A-Z])$';
    public static PAN_NUMBER = '^[A-Z]{5}[0-9]{4}[A-Z]{1}$';
    public static MOBILE = '^[0-9]{10}$';
    public static NAME = '^[a-zA-Z]+(?: [a-zA-Z]+)*$';
    public static NAME_NUMBER = '^[a-zA-Z0-9]+$';
    public static NUMBER = /^\d+$/;
    public static POINT_NUMBER = '^[+-]?([0-9]*[.])?[0-9]+$';
}